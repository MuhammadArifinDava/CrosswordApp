# smart_commit.ps1
# Script to automate granular commits
# Usage: ./smart_commit.ps1

Write-Host "Starting granular commit process..." -ForegroundColor Cyan

# 1. Docs: Deployment Guide
if (Test-Path "CrosswordApp/README_DEPLOYMENT.md") {
    git add "CrosswordApp/README_DEPLOYMENT.md"
    git commit -m "docs: Add detailed deployment guide for Netlify and Heroku"
    Write-Host "Committed: Deployment Guide" -ForegroundColor Green
}

# 2. Build: Netlify Config
if (Test-Path "CrosswordApp/netlify.toml") {
    git add "CrosswordApp/netlify.toml"
    git commit -m "build: Add Netlify configuration file"
    Write-Host "Committed: Netlify Config" -ForegroundColor Green
}

# 3. Build: SPA Redirects
if (Test-Path "CrosswordApp/client/public/_redirects") {
    git add "CrosswordApp/client/public/_redirects"
    git commit -m "build: Add SPA redirect rules for client routing"
    Write-Host "Committed: SPA Redirects" -ForegroundColor Green
}

# 4. Chore: Root Package Rename
if (Test-Path "CrosswordApp/package.json") {
    git add "CrosswordApp/package.json"
    git commit -m "chore: Rename root package to crossword-app-monorepo"
    Write-Host "Committed: Root Package" -ForegroundColor Green
}

# 5. Chore: Server Package Rename
if (Test-Path "CrosswordApp/server/package.json") {
    git add "CrosswordApp/server/package.json"
    git commit -m "chore: Rename server package to crossword-app-server"
    Write-Host "Committed: Server Package" -ForegroundColor Green
}

# 6. Config: Env Vars
if (Test-Path "CrosswordApp/server/src/config/env.js") {
    git add "CrosswordApp/server/src/config/env.js"
    git commit -m "config: Update environment variables for production support"
    Write-Host "Committed: Env Vars" -ForegroundColor Green
}

# 7. Feat: CORS & Health
if (Test-Path "CrosswordApp/server/src/app.js") {
    git add "CrosswordApp/server/src/app.js"
    git commit -m "feat: Enhance CORS policy and add health check endpoint"
    Write-Host "Committed: CORS & Health" -ForegroundColor Green
}

# 8. Feat: Error Boundary
if (Test-Path "CrosswordApp/client/src/components/ErrorBoundary.jsx") {
    git add "CrosswordApp/client/src/components/ErrorBoundary.jsx"
    git commit -m "feat: Add ErrorBoundary component for crash prevention"
    Write-Host "Committed: Error Boundary" -ForegroundColor Green
}

# 9. Refactor: Main App Wrap
if (Test-Path "CrosswordApp/client/src/main.jsx") {
    git add "CrosswordApp/client/src/main.jsx"
    git commit -m "refactor: Wrap application with ErrorBoundary"
    Write-Host "Committed: Main App Wrap" -ForegroundColor Green
}

# 10. Fix: Algo Fallback
if (Test-Path "CrosswordApp/server/src/utils/crosswordGenerator.js") {
    git add "CrosswordApp/server/src/utils/crosswordGenerator.js"
    git commit -m "fix: Add fallback logic for placing disconnected words"
    Write-Host "Committed: Algo Fallback" -ForegroundColor Green
}

# 11. Security: Score Logic
if (Test-Path "CrosswordApp/server/src/controllers/scoreController.js") {
    git add "CrosswordApp/server/src/controllers/scoreController.js"
    git commit -m "sec: Implement strict server-side score validation"
    Write-Host "Committed: Score Logic" -ForegroundColor Green
}

# 12. Fix: Client Player Logic
if (Test-Path "CrosswordApp/client/src/pages/CrosswordPlayer.jsx") {
    git add "CrosswordApp/client/src/pages/CrosswordPlayer.jsx"
    git commit -m "fix: Resolve linter errors and enhance player with sync logic"
    Write-Host "Committed: Player Logic" -ForegroundColor Green
}

# 13. Docs: Main Readme
if (Test-Path "README.md") {
    git add "README.md"
    git commit -m "docs: Update main README with deployment info and tech stack"
    Write-Host "Committed: Main Readme" -ForegroundColor Green
}

# 14. Docs: Changelog
if (Test-Path "CHANGELOG.md") {
    git add "CHANGELOG.md"
    git commit -m "docs: Create CHANGELOG.md to track recent updates"
    Write-Host "Committed: Changelog" -ForegroundColor Green
}

# 15. Chore: Final Polish
git add .
git commit -m "chore: Final code polish and workspace cleanup"
Write-Host "Committed: Final Polish" -ForegroundColor Green

Write-Host "`nAll commits completed!" -ForegroundColor Cyan
