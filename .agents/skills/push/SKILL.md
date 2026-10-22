---
name: push
description: >-
  Triggered when the user types "/push" or requests to sync the current branch with dev and push all changes.
---

# Git Push & Sync with Dev Skill (`/push`)

Use this skill whenever the user types `/push` or requests to synchronize the current working branch with the `dev` branch and push changes to remote.

## Strict Pre-condition: User-Triggered Only
Never execute a git push automatically without an explicit user invocation of `/push`, `/push-dev`, or a direct push command.

## Procedure

When activated, execute the following steps in sequence:

### Step 1: Automated Verification Gate
Before staging or pushing any code, run the full verification pipeline:
```bash
cd "server"
npm run test:verify
```
> [!IMPORTANT]
> If any test fails, STOP IMMEDIATELY. Do not commit or push broken code. Report the test failure to the user.

### Step 2: Stage & Commit Working Tree
Inspect git status:
```bash
git status
```
If there are modified or untracked files:
1. Stage all relevant changes: `git add .`
2. Commit with a structured Conventional Commit message in English:
   ```bash
   git commit -m "<type>(<scope>): <clear description in English>"
   ```

### Step 3: Synchronize with `dev` and Push
1. Fetch latest changes from remote:
   ```bash
   git fetch origin
   ```
2. Determine current active branch:
   - **Case A: Currently on `dev` branch**:
     ```bash
     git pull --rebase origin dev
     git push origin dev
     ```
   - **Case B: Currently on a feature branch (e.g., `feature/xyz`)**:
     1. Rebase or merge `origin/dev` into the current branch:
        ```bash
        git merge origin/dev
        git push origin <current-branch>
        ```
     2. Switch to `dev`, merge current branch into `dev`, and push:
        ```bash
        git checkout dev
        git pull origin dev
        git merge <current-branch>
        git push origin dev
        git checkout <current-branch>
        ```

### Step 4: Output Status Report
Respond in Vietnamese summarizing:
- Latest commit hash and message.
- Test suites executed and passed count.
- Status of synchronized branches (`dev` and active branch).
