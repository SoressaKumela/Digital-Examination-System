# SCRIPT TO PREPARE THE WORKSPACE FOR MEMBER 3 (BACKEND API DEVELOPER)

Write-Host "🧹 Cleaning project for Member 3: Backend API Developer..." -ForegroundColor Yellow

# Remove Root Configs (Member 1 handles these)
Remove-Item -ErrorAction SilentlyContinue -Force package.json, package-lock.json, bun.lockb, tsconfig*, vite.config.ts, tailwind.config.ts, postcss.config.js, index.html, components.json, README.md
Remove-Item -ErrorAction SilentlyContinue -Force exam-system-backend/pom.xml
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force nbproject, public

# Remove Database Layer (Member 2 handles these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/model
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force exam-system-backend/src/main/java/com/exam/dao
Remove-Item -ErrorAction SilentlyContinue -Force exam-system-backend/src/main/java/com/exam/config/DBConnection.java
Remove-Item -ErrorAction SilentlyContinue -Force exam-system-backend/src/main/webapp/META-INF/context.xml

# Remove All Frontend Source (Members 4 & 5 handle these)
Remove-Item -ErrorAction SilentlyContinue -Recurse -Force src

Write-Host "✅ Cleanup Complete! You are ready to commit the API & Services." -ForegroundColor Green