# Creates carclickbd-hostinger.zip for Hostinger "Upload your app files"
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path (Split-Path -Parent $projectRoot) "carclickbd-hostinger.zip"
$stage = Join-Path $env:TEMP ("carclickbd-hostinger-" + [guid]::NewGuid().ToString("n"))

New-Item -ItemType Directory -Path $stage | Out-Null

robocopy $projectRoot $stage /E /NFL /NDL /NJH /NJS /NC /NS `
  /XD node_modules .next .git .husky coverage out build .vercel `
  /XF *.zip *.tar.gz *.tgz .env .env.local .env.development .env.production eps-config.json "page copy.tsx" desktop.ini Thumbs.db

if ($LASTEXITCODE -ge 8) {
  throw "robocopy failed with exit code $LASTEXITCODE"
}

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zipPath -CompressionLevel Optimal
Remove-Item $stage -Recurse -Force

Write-Host "Created: $zipPath"
