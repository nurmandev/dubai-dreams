# ============================================================
#  cPanel Production Build Script
#  Packages as .tar.gz to avoid antivirus false positives
#
#  Run from the project ROOT:
#    .\build_for_cpanel.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ROOT = $PSScriptRoot

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  cPanel Production Build Script" -ForegroundColor Cyan
Write-Host "  (Output: .tar.gz format)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ───────────────────────────────────────────────────────────
# STEP 1: BUILD BACKEND (TypeScript -> dist/)
# ───────────────────────────────────────────────────────────
Write-Host "[STEP 1] Building backend (TypeScript compile)..." -ForegroundColor Yellow
Set-Location "$ROOT\backend"

Write-Host "  Installing backend dependencies..."
npm install --legacy-peer-deps | Out-Null

Write-Host "  Compiling TypeScript..."
npm run build

if (-not (Test-Path "$ROOT\backend\dist\server.js")) {
    Write-Host "  [ERROR] dist/server.js not found after build!" -ForegroundColor Red
    exit 1
}
Write-Host "  Backend build complete." -ForegroundColor Green

# ───────────────────────────────────────────────────────────
# STEP 2: PACKAGE BACKEND -> backend_build_final.tar.gz
# ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[STEP 2] Packaging backend as backend_build_final.tar.gz..." -ForegroundColor Yellow

# Build a clean staging folder (no node_modules, no src, no tsconfig)
$backendStage = "$ROOT\_backend_stage"
if (Test-Path $backendStage) { Remove-Item $backendStage -Recurse -Force }
New-Item -ItemType Directory -Path $backendStage | Out-Null

Copy-Item -Path "$ROOT\backend\dist"         -Destination "$backendStage\dist"         -Recurse
Copy-Item -Path "$ROOT\backend\package.json" -Destination "$backendStage\package.json"
Copy-Item -Path "$ROOT\backend\.env"         -Destination "$backendStage\.env"

if (Test-Path "$ROOT\backend\package-lock.json") {
    Copy-Item -Path "$ROOT\backend\package-lock.json" -Destination "$backendStage\package-lock.json"
}

$backendTar = "$ROOT\backend_build_final.tar.gz"
if (Test-Path $backendTar) { Remove-Item $backendTar -Force }

# tar -czf: create gzip-compressed archive of CONTENTS (not the folder wrapper)
tar -czf "$backendTar" -C "$backendStage" .

Remove-Item $backendStage -Recurse -Force

Write-Host "  [OK] Created: backend_build_final.tar.gz" -ForegroundColor Green

# ───────────────────────────────────────────────────────────
# STEP 3: BUILD FRONTEND (Vite -> dist/)
# ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[STEP 3] Building frontend (Vite)..." -ForegroundColor Yellow
Set-Location "$ROOT\frontend"

$hasPnpm = (Get-Command pnpm -ErrorAction SilentlyContinue) -ne $null
if ($hasPnpm) {
    Write-Host "  Installing frontend deps (pnpm)..."
    pnpm install | Out-Null
    Write-Host "  Building (pnpm)..."
    pnpm run build
} else {
    Write-Host "  Installing frontend deps (npm)..."
    npm install --legacy-peer-deps | Out-Null
    Write-Host "  Building (npm)..."
    npm run build
}

if (-not (Test-Path "$ROOT\frontend\dist\index.html")) {
    Write-Host "  [ERROR] frontend/dist/index.html not found!" -ForegroundColor Red
    exit 1
}
Write-Host "  Frontend build complete." -ForegroundColor Green

# ───────────────────────────────────────────────────────────
# STEP 4: PACKAGE FRONTEND -> frontend_build_final.tar.gz
# ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[STEP 4] Packaging frontend as frontend_build_final.tar.gz..." -ForegroundColor Yellow

$frontendTar = "$ROOT\frontend_build_final.tar.gz"
if (Test-Path $frontendTar) { Remove-Item $frontendTar -Force }

# Zip CONTENTS of dist/ (not the dist folder itself)
tar -czf "$frontendTar" -C "$ROOT\frontend\dist" .

Write-Host "  [OK] Created: frontend_build_final.tar.gz" -ForegroundColor Green

# ───────────────────────────────────────────────────────────
# STEP 5: Create .htaccess for React Router (SPA fallback)
# ───────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[STEP 5] Creating .htaccess file..." -ForegroundColor Yellow

$htaccess = "Options -MultiViews`r`nRewriteEngine On`r`nRewriteCond %{REQUEST_FILENAME} !-f`r`nRewriteCond %{REQUEST_FILENAME} !-d`r`nRewriteRule ^ index.html [QSA,L]"
$htaccessPath = "$ROOT\htaccess_for_cpanel.txt"
Set-Content -Path $htaccessPath -Value $htaccess -Encoding UTF8

Write-Host "  [OK] Created: htaccess_for_cpanel.txt" -ForegroundColor Green
Write-Host "  NOTE: Rename to .htaccess after uploading into public_html." -ForegroundColor DarkCyan

# ───────────────────────────────────────────────────────────
# DONE
# ───────────────────────────────────────────────────────────
Set-Location $ROOT

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ALL DONE! Files ready for cPanel:" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  frontend_build_final.tar.gz" -ForegroundColor White
Write-Host "    -> Upload to public_html (or subdomain folder), then Extract" -ForegroundColor Gray
Write-Host ""
Write-Host "  backend_build_final.tar.gz" -ForegroundColor White
Write-Host "    -> Upload to your backend app folder, then Extract" -ForegroundColor Gray
Write-Host ""
Write-Host "  htaccess_for_cpanel.txt" -ForegroundColor White
Write-Host "    -> Upload to public_html and rename to .htaccess" -ForegroundColor Gray
Write-Host ""
Write-Host "  After extracting backend on cPanel:" -ForegroundColor Yellow
Write-Host "  1. Setup Node.js App -> Run NPM Install" -ForegroundColor White
Write-Host "  2. Click Restart Application" -ForegroundColor White
Write-Host ""
