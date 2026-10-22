---
name: push-dev
description: >-
  Triggered when the user types "/push-dev" or requests to push changes directly and exclusively to the dev branch.
---

# Git Push Exclusively to Dev Skill (`/push-dev`)

Use this skill whenever the user types `/push-dev` or requests to push code exclusively to the `dev` branch on the remote repository.

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
> If any test fails, STOP IMMEDIATELY. Do not push unverified or failing code. Report the error directly to the user.

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

### Step 3: Push Exclusively to Remote `dev`
1. Fetch latest changes from remote:
   ```bash
   git fetch origin dev
   ```
2. Determine current active branch:
   - **Case A: Currently on `dev` branch**:
     ```bash
     git pull --rebase origin dev
     git push origin dev
     ```
   - **Case B: Currently on another branch**:
     ```bash
     git checkout dev
     git pull origin dev
     git merge <previous-branch>
     git push origin dev
     ```

### Step 4: Output Status Report
Respond in Vietnamese summarizing:
- Latest commit hash and message on `dev`.
- Verification test suite result.
- GitHub commit link for user inspection.
