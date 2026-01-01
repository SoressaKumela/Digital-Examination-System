# SCRIPT TO PREPARE THE WORKSPACE FOR MEMBER 2 (DATABASE ENGINEER)

Write-Host "🧹 Cleaning project for Member 2: Database Engineer..." -ForegroundColor Yellow

# Remove Root Configs (Member 1 handles these)
Remove-Item -ErrorAction SilentlyContinue -Force package.json, package-lock.json, bun.lockb, tsconfig*, vite.config.ts, tailwind.config.ts, postcss.config.js, index.html, components.json, README.md
Remove-Item -ErrorAction SilentlyContinue -Force exam-system-backend/pom.xml
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force nbproject, public

# Remove API & Logic Layers (Member 3 handles these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/controller
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/service
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/filter
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/util
Remove-Item -ErrorAction SilentlyContinue -Force exam-system-backend/webapp/WEB-INF/web.xml

# Remove All Frontend Source (Members 4 & 5 handle these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force src

Write-Host "✅ Cleanup Complete! You are ready to commit the Database Layer." -ForegroundColor Green