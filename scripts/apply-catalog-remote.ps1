[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string]$ProjectRef,

  [Parameter(Mandatory = $false)]
  [switch]$SkipLocalChecks,

  [Parameter(Mandatory = $false)]
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$supabaseCommand = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCommand) { $supabaseCommand = Get-Command supabase.cmd -ErrorAction SilentlyContinue }
if (-not $supabaseCommand -and -not (Get-Command npx.cmd -ErrorAction SilentlyContinue)) {
  throw 'Install the Supabase CLI or Node/npm before running the remote catalog provisioning sequence.'
}

function Get-DotEnvValue([string]$Name) {
  $envPath = Join-Path $PSScriptRoot '..\.env.local'
  if (-not (Test-Path -LiteralPath $envPath)) { return $null }
  $line = Get-Content -LiteralPath $envPath | Where-Object { $_ -match ("^\s*" + [regex]::Escape($Name) + "\s*=") } | Select-Object -First 1
  if (-not $line) { return $null }
  $value = ($line -split '=', 2)[1].Trim()
  return $value.Trim('"', "'")
}

$SupabaseCliPackage = 'supabase@2.116.0'

function Invoke-SupabaseCli([string[]]$Arguments) {
  $cliOutput = $null
  if ($supabaseCommand) {
    $cliOutput = & $supabaseCommand.Source @Arguments 2>&1
  } else {
    $cliOutput = & npx.cmd --yes $SupabaseCliPackage @Arguments 2>&1
  }
  if ($LASTEXITCODE -ne 0) {
    $details = ($cliOutput | Out-String).Trim()
    if ([string]::IsNullOrWhiteSpace($details)) { $details = 'The CLI returned no diagnostic output.' }
    throw ("Supabase CLI command failed: supabase {0}`n{1}" -f (($Arguments -join ' '), $details))
  }
  $cliOutput
}

if (-not $SkipLocalChecks) {
  $localChecks = @('catalog:preflight')
  foreach ($check in $localChecks) {
    Write-Host ("Running local preflight: npm run {0}" -f $check)
    & npm.cmd run $check
    if ($LASTEXITCODE -ne 0) { throw ("Local catalog preflight failed: {0}" -f $check) }
  }
}

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
  $supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
  if ([string]::IsNullOrWhiteSpace($supabaseUrl)) { $supabaseUrl = Get-DotEnvValue 'NEXT_PUBLIC_SUPABASE_URL' }
  if ($supabaseUrl -and $supabaseUrl -match '^https://([a-z0-9-]+)\.supabase\.co/?$') {
    $ProjectRef = $Matches[1]
    Write-Host ("Derived Supabase project ref from NEXT_PUBLIC_SUPABASE_URL: {0}" -f $ProjectRef)
  }
}

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
  throw 'A Supabase project ref is required. Pass -ProjectRef, or set NEXT_PUBLIC_SUPABASE_URL to a project URL such as https://<project-ref>.supabase.co.'
}

if ($DryRun) {
  $migrationFiles = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..\supabase\migrations') -Filter '*.sql' -File | Sort-Object Name
  $seedFiles = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..\supabase\seed') -Filter '*.sql' -File | Sort-Object Name
  Write-Host ("Catalog provisioning dry run for project ref: {0}" -f $ProjectRef)
  Write-Host ("Migrations to push: {0}" -f $migrationFiles.Count)
  $migrationFiles | ForEach-Object { Write-Host ("  migration: {0}" -f $_.Name) }
  Write-Host ("Seed files to apply in order: {0}" -f $seedFiles.Count)
  $seedFiles | ForEach-Object { Write-Host ("  seed: {0}" -f $_.Name) }
  Write-Host 'Dry run complete. No Supabase authentication, link, migration push, seed write, or release-check query was performed.'
  exit 0
}

Write-Host 'Running read-only provisioning readiness...'
& npm.cmd run ops:catalog-readiness -- --require-ready
if ($LASTEXITCODE -ne 0) {
  throw 'Remote catalog provisioning readiness failed; no authentication, link, migration, seed, or release-check write was attempted.'
}

Write-Host 'Checking Supabase CLI authentication...'
try {
  $null = Invoke-SupabaseCli @('projects', 'list')
} catch {
  $details = $_.Exception.Message
  if ($details -match 'access token|supabase login|SUPABASE_ACCESS_TOKEN|LegacyPlatformAuth') {
    throw 'Supabase CLI authentication is required before remote catalog provisioning. On Windows PowerShell, run `npx.cmd --yes supabase@2.116.0 login` or set SUPABASE_ACCESS_TOKEN in the current environment, then rerun this script.'
  }
  throw ("Supabase CLI preflight failed before remote catalog writes: {0}" -f $details)
}

Write-Host 'Linking the Supabase project...'
Invoke-SupabaseCli @('link', '--project-ref', $ProjectRef)

Write-Host 'Pushing ordered migrations...'
Invoke-SupabaseCli @('db', 'push')

$seedFiles = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..\supabase\seed') -Filter '*.sql' -File | Sort-Object Name
Write-Host ("Applying {0} ordered seed files..." -f $seedFiles.Count)
foreach ($seedFile in $seedFiles) {
  Write-Host ("Applying seed: {0}" -f $seedFile.Name)
  Invoke-SupabaseCli @('db', 'query', '--linked', '--file', $seedFile.FullName)
}

Write-Host 'Running catalog release checks...'
$releaseChecks = Join-Path $PSScriptRoot '..\supabase\tests\catalog_release_checks.sql'
Invoke-SupabaseCli @('db', 'query', '--linked', '--file', $releaseChecks)

Write-Host 'Catalog remote provisioning sequence completed.'
