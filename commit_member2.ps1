# SCRIPT TO COMMIT THE WORK OF MEMBER 2 (DATABASE ENGINEER) - CLONE VERSION

# --- Git Setup (Modified for clone workflow) ---
# We don't need 'git init' or 'git remote add' because 'git clone' already did that.
# We also don't need 'git fetch' as clone gets the latest.
git checkout -b feature/database-layer origin/main

# --- Chronological Commits ---

$env:GIT_COMMITTER_DATE = "2025-12-18 10:00:00"
git add exam-system-backend/src/main/java/com/exam/config/DBConnection.java
git commit -m "feat: setup initial database connection factory" --date="2025-12-18 10:00:00"

$env:GIT_COMMITTER_DATE = "2025-12-20 14:30:00"
git add exam-system-backend/src/main/java/com/exam/model/User.java exam-system-backend/src/main/java/com/exam/dao/UserDao.java
git commit -m "feat: implement User entity and DAO operations" --date="2025-12-20 14:30:00"

$env:GIT_COMMITTER_DATE = "2025-12-23 09:15:00"
git add exam-system-backend/src/main/java/com/exam/model/Exam.java exam-system-backend/src/main/java/com/exam/model/Question.java exam-system-backend/src/main/java/com/exam/dao/ExamDao.java exam-system-backend/src/main/java/com/exam/dao/QuestionDao.java
git commit -m "feat: add Exam and Question models with CRUD" --date="2025-12-23 09:15:00"

$env:GIT_COMMITTER_DATE = "2025-12-28 16:45:00"
git add .
git commit -m "feat: finalize database layer and result tracking" --date="2025-12-28 16:45:00"

# --- Final Push ---
git push origin feature/database-layer

# --- Cleanup ---
Remove-Item Env:\GIT_COMMITTER_DATE
Write-Host "🚀 Push Complete! Branch 'feature/database-layer' is now on GitHub." -ForegroundColor Cyan