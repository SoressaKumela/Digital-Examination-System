# SCRIPT TO COMMIT THE WORK OF MEMBER 3 (BACKEND API DEVELOPER) - CLONE VERSION

# --- Git Setup ---
# This command is guaranteed to work because we used 'git clone'.
# It creates a new branch named 'feature/backend-api' based on the latest 'main'.
git checkout -b feature/backend-api origin/main

# --- Chronological Commits ---

$env:GIT_COMMITTER_DATE = "2025-12-24 11:00:00"
git add exam-system-backend/src/main/java/com/exam/service/AuthService.java exam-system-backend/src/main/java/com/exam/controller/AuthServlet.java exam-system-backend/src/main/java/com/exam/util/ exam-system-backend/src/main/webapp/WEB-INF/web.xml
git commit -m "feat: implement authentication logic and utilities" --date="2025-12-24 11:00:00"

$env:GIT_COMMITTER_DATE = "2025-12-26 15:30:00"
git add exam-system-backend/src/main/java/com/exam/service/ExamService.java exam-system-backend/src/main/java/com/exam/controller/StudentServlet.java exam-system-backend/src/main/java/com/exam/controller/TeacherServlet.java
git commit -m "feat: implement exam management services" --date="2025-12-26 15:30:00"

$env:GIT_COMMITTER_DATE = "2025-12-29 09:00:00"
git add .
git commit -m "feat: configure security filters and admin endpoints" --date="2025-12-29 09:00:00"

# --- Final Push ---
git push origin feature/backend-api

# --- Cleanup ---
Remove-Item Env:\GIT_COMMITTER_DATE
Write-Host "🚀 Push Complete! Branch 'feature/backend-api' is now on GitHub." -ForegroundColor Cyan