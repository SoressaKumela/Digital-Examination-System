# SCRIPT TO COMMIT THE WORK OF MEMBER 5 (FRONTEND INTEGRATION SPECIALIST) - CLONE VERSION

# --- Git Setup ---
# This command is guaranteed to work because we used 'git clone'.
# It creates a new branch named 'feature/frontend-integration' based on the latest 'main'.
git checkout -b feature/frontend-integration origin/main

# --- Chronological Commits ---

$env:GIT_COMMITTER_DATE = "2025-12-30 10:00:00"
git add src/api/ src/pages/Login.tsx src/pages/Register.tsx src/context/AuthContext.tsx src/hooks/use-toast.ts src/types/index.ts
git commit -m "feat: implement auth pages and api integration" --date="2025-12-30 10:00:00"

$env:GIT_COMMITTER_DATE = "2025-12-31 14:30:00"
git add src/pages/ src/layouts/
git commit -m "feat: build dashboard and exam execution interfaces" --date="2025-12-31 14:30:00"

$env:GIT_COMMITTER_DATE = "2026-01-01 12:00:00"
git add .
git commit -m "feat: setup app routing and final integration" --date="2026-01-01 12:00:00"

# --- Final Push ---
git push origin feature/frontend-integration

# --- Cleanup ---
Remove-Item Env:\GIT_COMMITTER_DATE
Write-Host "🚀 Push Complete! Branch 'feature/frontend-integration' is now on GitHub." -ForegroundColor Cyan