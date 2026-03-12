# Workflow 3: Merge Workflow (Code Ready to Ship)

**Goal:** Merge code safely without breaking main branch.

**When:** Feature is complete, tested, and verified working.

**Duration:** 25 minutes per feature (from "ready" to "shipped")

---

## Pre-Merge Checklist

Before pushing to PR:

```
Code Quality:
  ☐ No compiler errors (mvn compile / npm build succeeds)
  ☐ Tests pass (mvn test / npm test passes)
  ☐ No console errors/warnings (F12 shows clean console)

Functionality:
  ☐ Feature works manually (tested in app)
  ☐ No obvious bugs
  ☐ Doesn't break other features (quick smoke test)

Git Hygiene:
  ☐ Commit messages are clear ("Add login form" not "fix")
  ☐ No large debug commits
  ☐ Commits are small (easy to revert if needed)

Documentation:
  ☐ Code has comments (if confusing)
  ☐ API changes documented in contract
```

---

## Step-by-Step Merge

### 1. Push Branch
```bash
git push origin feature-name
```

### 2. Create Pull Request
```bash
gh pr create \
  --title "Add login form" \
  --body "Closes issue #2. Tests: ✓ Pass"
```

### 3. Request Code Review
```
Assign: 1 teammate
Time: 5-15 min review

Use Claude Code:
"Review my [component/endpoint] for bugs"
→ Gets instant feedback
```

### 4. Address Feedback
```
If reviewer says "Fix X":
- Make change
- Re-test
- Push again (same PR auto-updates)
```

### 5. Merge
```bash
gh pr merge --squash   # Squash commits (clean history)
# Delete branch after merge
```

### 6. Verify on Main
```
- Pull latest main
- npm install / mvn install
- Run full app: docker compose up
- Smoke test: Feature still works?
- ✓ All good → Feature shipped
```

---

## Code Review Template (Lightweight)

Reviewer (Claude or teammate) checks:
- ✅ Does code work? (tests pass)
- ✅ Any obvious bugs? (logic errors)
- ✅ Follows project structure? (files in right place)
- ✅ Is it understandable? (if confusing, add comment)

Reviewer comments:
```
👍 "Looks good!"
or
🔧 "Change X because Y"
or
❓ "Why did you do it this way?"
```

**NOT checking:**
- ❌ Perfect variable names
- ❌ Refactoring opportunities
- ❌ Code style (too slow for hackathon)

---

## Merge Conflicts

If conflict happens:
```bash
git merge origin/main
# Conflicts show up

Fix manually:
- Keep both changes if possible
- Ask teammate if unsure
- Re-test after fix

Prevention: Use git worktrees (isolated branches)
```

---

## Timeline Example

```
T+2h30min: Feature ready
  ↓ (5 min) Push & create PR
T+2h35min: Code review starts
  ↓ (10 min) Claude Code reviews
T+2h45min: Get feedback "Fix button label"
  ↓ (5 min) Fix & push
T+2h50min: Approve & merge
  ↓ (5 min) Verify on main
T+2h55min: ✓ SHIPPED to main
```

---

## Gotchas

| Problem | Prevention | Fix |
|---------|-----------|-----|
| Tests fail on main | Run tests before push | Revert merge, fix, re-merge |
| Conflicts on merge | Use worktrees | Resolve manually, re-test |
| Feature breaks main | Verify on main after merge | Hotfix immediately |
| Merge takes 1+ hour | Lightweight review (5-15 min) | Skip perfection, focus on bugs |

---

## Ask Claude Code

```
"Review my code for bugs"
→ Claude checks in 5 min
→ You fix feedback
→ Ready to merge

or

"Help me merge [branch] safely"
→ Claude walks you through steps
```

---

## Why This Matters

- ✅ Clean main branch (always deployable)
- ✅ Fast reviews (5-15 min, not 1 hour)
- ✅ Small safe merges (easy to revert if needed)
- ✅ Everyone can work in parallel (no conflicts)

**Result:** Features ship every 30-45 min without breaking main
