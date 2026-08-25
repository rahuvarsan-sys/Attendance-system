@echo off
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%PATH%"
echo Pushing to GitHub repository...
git push -u origin main --force
pause
