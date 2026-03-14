$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $projectRoot "dist"
$stageDir = Join-Path $distDir "anti-ultra-firefox-stage"
$zipPath = Join-Path $distDir "anti-ultra-firefox-1.0.0.zip"
$xpiPath = Join-Path $distDir "anti-ultra-firefox-1.0.0.xpi"

$rootFiles = @(
  "manifest.json",
  "browser-api.js",
  "content.js",
  "popup.html",
  "popup.js",
  "popup.css",
  "LICENSE",
  "PRIVACY.md"
)

$iconFiles = @(
  "icon-16.png",
  "icon-32.png",
  "icon-48.png",
  "icon-128.png"
)

New-Item -ItemType Directory -Path $distDir -Force | Out-Null
Remove-Item $stageDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item $xpiPath -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Path (Join-Path $stageDir "icons") -Force | Out-Null

foreach ($file in $rootFiles) {
  Copy-Item (Join-Path $projectRoot $file) $stageDir
}

foreach ($icon in $iconFiles) {
  Copy-Item (Join-Path $projectRoot "icons\$icon") (Join-Path $stageDir "icons")
}

Compress-Archive -Path (Join-Path $stageDir "*") -DestinationPath $zipPath -Force
Rename-Item -Path $zipPath -NewName "anti-ultra-firefox-1.0.0.xpi"
Remove-Item $stageDir -Recurse -Force

Write-Output $xpiPath
