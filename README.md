# TrackingIssue
=========xxx=======

Project Source:
---------------
- 
- 

Feature:
--------
- Email by using Gmail SMTP
- User Pages
- Admin Pages


Fixes and Bugs
- 


Git Basic:
----------
1. Add New Project to GitHub
1.1 Create Project in GitHub
1.2 Commit New Project
- echo "# TrackingIssue" >> README.md
- git init
- git add README.md
- git commit -m "Add read me"
- git remote add origin https://github.com/paoim/TrackingIssue.git

- Add ignore by Manual on GitHub

- git add pom.xml
- git add src/
- git commit -m "Create Tracking Issue"
- git branch --set-upstream-to=origin/master
- git pull --rebase
- git push

2. Commit New
- git add src/main/java/com/rii/track/service/TodoServiceImpl.java
- git commit -m "Fixed on email feature"
- git pull --rebase
- git push
