[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$UserId,

  [Parameter(Mandatory = $false)]
  [string]$Email,

  [Parameter(Mandatory = $false)]
  [string]$ProjectRef
)

$ErrorActionPreference = 'Stop'

$parsedUserId = [guid]::Empty
if (-not [guid]::TryParse($UserId, [ref]$parsedUserId)) {
  throw 'UserId must be the UUID of an existing Supabase Auth user.'
}

if ($Email.Length -gt 320) {
  throw 'Email must be 320 characters or fewer.'
}

$supabaseCommand = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCommand) { $supabaseCommand = Get-Command supabase.cmd -ErrorAction SilentlyContinue }
$supabaseCliPackage = 'supabase@2.116.0'

function Invoke-SupabaseCli([string[]]$Arguments) {
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
  if ($supabaseCommand) {
    $output = & $supabaseCommand.Source @Arguments 2>&1
  } else {
    $output = & npx.cmd --yes --silent $supabaseCliPackage @Arguments 2>&1
  }
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
  if ($LASTEXITCODE -ne 0) {
    $details = ($output | Out-String).Trim()
    if ([string]::IsNullOrWhiteSpace($details)) { $details = 'The CLI returned no diagnostic output.' }
    throw ("Supabase CLI command failed: supabase {0}`n{1}" -f (($Arguments -join ' '), $details))
  }
  return $output
}

function Get-DotEnvValue([string]$Name) {
  $envPath = Join-Path $PSScriptRoot '..\.env.local'
  if (-not (Test-Path -LiteralPath $envPath)) { return $null }
  $line = Get-Content -LiteralPath $envPath |
    Where-Object { $_ -match ("^\s*" + [regex]::Escape($Name) + "\s*=") } |
    Select-Object -First 1
  if (-not $line) { return $null }
  return (($line -split '=', 2)[1].Trim()).Trim('"', "'")
}

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
  $supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
  if ([string]::IsNullOrWhiteSpace($supabaseUrl)) { $supabaseUrl = Get-DotEnvValue 'NEXT_PUBLIC_SUPABASE_URL' }
  if ($supabaseUrl -and $supabaseUrl -match '^https://([a-z0-9-]+)\.supabase\.co/?$') {
    $ProjectRef = $Matches[1]
  }
}

if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
  throw 'A Supabase project ref is required. Pass -ProjectRef or set NEXT_PUBLIC_SUPABASE_URL.'
}

Write-Host 'Checking Supabase CLI authentication...'
$null = Invoke-SupabaseCli @('projects', 'list')

Write-Host ("Linking project {0}..." -f $ProjectRef)
$null = Invoke-SupabaseCli @('link', '--project-ref', $ProjectRef)

$escapedUserId = $parsedUserId.ToString()
$escapedEmail = if ([string]::IsNullOrWhiteSpace($Email)) { 'null' } else { "'" + $Email.Replace("'", "''") + "'" }
$sql = @"
insert into public.catalog_reviewers (user_id, email_snapshot, active)
values ('$escapedUserId'::uuid, $escapedEmail, true)
on conflict (user_id) do update
set email_snapshot = excluded.email_snapshot,
    active = true;
"@

$temporarySql = New-TemporaryFile
try {
  [System.IO.File]::WriteAllText($temporarySql.FullName, $sql, [System.Text.UTF8Encoding]::new($false))
  Write-Host ("Adding or reactivating catalog reviewer {0}..." -f $escapedUserId)
  $null = Invoke-SupabaseCli @('db', 'query', '--linked', '--file', $temporarySql.FullName)
} finally {
  Remove-Item -LiteralPath $temporarySql.FullName -Force -ErrorAction SilentlyContinue
}

Write-Host 'Catalog reviewer bootstrap completed.'
