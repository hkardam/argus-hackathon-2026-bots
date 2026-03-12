---
name: merge-workflow
description: Use when code is ready to merge - verify checks, request review, and safely merge without breaking main branch
---

# Merge Workflow

## Overview

Ship code safely to main without breaking anything. Fast lightweight reviews (5-15 min) + systematic verification.

## When to Use

- Feature is complete and tested
- Tests pass locally
- Feature works manually
- Ready to ship to main

## Pre-Merge Checklist

```
Code Quality:
  ☐ No compiler errors (mvn compile / npm build succeeds)
  ☐ Tests pass (mvn test / npm test passes)
  ☐ No console errors/warnings (F12 shows clean)

Functionality:
  ☐ Feature works manually (tested in app)
  ☐ Doesn't break other features (quick smoke test)

Git:
  ☐ Commit messages clear ("Add login form" not "fix")
  ☐ Small commits (easy to revert)

Docs:
  ☐ Comments if code is confusing
  ☐ API contract updated (if relevant)
```

## Step-by-Step Merge

### 1. Push Branch
```bash
git push origin feature-name
```

### 2. Create Pull Request
```bash
gh pr create \
  --title "Add login form" \
  --body "Tests: ✓ Pass. Works on main: ✓"
```

### 3. Request Code Review
```
Use Claude Code:
"Review my [component/endpoint] for bugs"
→ Gets feedback in 5 min

Assign teammate if needed (time: 5-15 min)
```

### 4. Address Feedback
```
Reviewer says "Fix X":
- Make change
- Re-test
- Push again (PR auto-updates)
```

### 5. Merge
```bash
gh pr merge --squash   # Clean history
# Delete branch
```

### 6. Verify on Main
```
- docker compose up
- Smoke test: Feature still works?
- ✓ SHIPPED
```

## Code Review (Lightweight)

Reviewer checks:
- ✅ Does code work? (tests pass)
- ✅ Any obvious bugs? (logic errors)
- ✅ Follows project structure?
- ✅ Understandable? (add comments if not)

**NOT checking:**
- ❌ Perfect naming
- ❌ Refactoring opportunities
- ❌ Code style

## Timeline Example

```
T+2h30min: Feature ready → T+2h35min: PR created
T+2h35min: Review starts → T+2h45min: Feedback
T+2h45min: Fix feedback → T+2h50min: Re-merge
T+2h50min: Verify main → T+2h55min: ✓ SHIPPED

Total: 25 minutes from "ready" to "shipped"
```

## Merge Conflicts

If conflict:
```bash
git merge origin/main
# Conflicts show

Fix manually:
- Keep both changes if possible
- Ask teammate if unsure
- Re-test
```

Prevention: Use git worktrees (isolated branches)

## Full Workflow

See: `workflows/3-merge-workflow.md`

## Ask Claude Code

```
"Review my code for bugs"
→ Claude checks in 5 min

"Help me merge safely"
→ Claude walks through steps
```

## Gotchas

| Problem | Prevention | Fix |
|---------|-----------|-----|
| Tests fail on main | Run before push | Revert, fix, re-merge |
| Conflicts | Use worktrees | Resolve + re-test |
| Breaks main | Verify on main | Hotfix immediately |
| Takes 1+ hour | Lightweight review | 5-15 min max |

## Result

✅ Clean main branch (always deployable)
✅ Ship every 30-45 min
✅ No conflicts (isolated work)
✅ Fast reviews (Claude Code helps)
