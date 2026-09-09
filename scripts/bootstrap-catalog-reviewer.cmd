@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0bootstrap-catalog-reviewer.ps1" %*
exit /b %ERRORLEVEL%
