# SCRIPT TO PREPARE THE WORKSPACE FOR MEMBER 5 (FRONTEND INTEGRATION SPECIALIST)

Write-Host "🧹 Cleaning project for Member 5: Frontend Integration Specialist..." -ForegroundColor Yellow

# Remove Root Configs (Member 1 handles these)
Remove-Item -ErrorAction SilentlyContinue -Force package.json, package-lock.json, bun.lockb, tsconfig*, vite.config.ts, tailwind.config.ts, postcss.config.js, index.html, components.json, README.md
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force nbproject, public

# Remove Backend Completely (Members 2 & 3 handle these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend

# Remove UI Component Layer (Member 4 handles these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force src/components
Remove-Item -ErrorAction SilentlyContinue -Force src/lib/utils.ts
Remove-Item -ErrorAction SilentlyContinue -Force src/hooks/use-mobile.tsx
Remove-Item -ErrorAction SilentlyContinue -Force src/index.css
Remove-Item -ErrorAction SilentlyContinue -Force src/App.css

Write-Host "✅ Cleanup Complete! You are ready to commit the Pages & Integration Layer." -ForegroundColor Green