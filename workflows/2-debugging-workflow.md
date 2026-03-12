# Workflow 2: Debugging Workflow (When Things Break)

**Goal:** Find & fix bugs fast without wasting time on wrong diagnosis.

**When:** Test fails, app crashes, or feature doesn't work.

**Time limit:** 15 minutes max per bug (then ask for help)

---

## Decision Tree (Follow This)

```
BUG FOUND
  ↓
Is it a COMPILE ERROR? (Red squiggly lines)
  ├─ YES → Fix syntax/types
  │         mvn clean compile OR npm run build
  │         ✓ Compiler tells you what's wrong
  │
  └─ NO → Continue...
           ↓
Is it a TEST FAILURE? (Test output shows failure)
  ├─ YES → Check test output
  │         "Expected X, got Y"
  │         → Fix code OR test assertion
  │         → Re-run test
  │         ✓ Quick & clear
  │
  └─ NO → Continue...
           ↓
Is it RUNTIME ERROR? (App crashes / 500 error)
  ├─ YES → Check error logs
  │         Frontend: Browser console (F12)
  │         Backend: docker compose logs server
  │         ✓ Stack trace points to line
  │
  └─ NO → Continue...
           ↓
Is it FUNCTIONAL BUG? (App runs, feature doesn't work)
  ├─ YES → Use DEBUGGING CHECKLIST below
  │
  └─ NO → Not sure what's wrong?
           Ask Claude: "Why isn't [feature] working?"
```

---

## Functional Bug Debugging Checklist

### 1. Isolate the Problem
```
DON'T: "The whole app doesn't work"
DO:    "When I click button X, Y doesn't happen"
```

### 2. Check Frontend (If UI Issue)
```
- Open browser console (F12)
- Look for red errors
- Check Network tab
  - Does request go out?
  - Does response come back?
  - Is response correct format?

If response is wrong → Backend bug
If response is right → Frontend bug
```

### 3. Check Backend (If API Issue)
```
- Test endpoint with curl/Postman:
  curl http://localhost:8086/api/users

- Does it return data?
- Is format correct?
- Any errors in logs?

docker compose logs server
```

### 4. Check Integration (If Both Work Separately)
```
- Frontend calling wrong URL?
- Frontend parsing response wrong?
- Backend returning wrong format?

Test: Call API from frontend
  console.log(response) → check format
```

---

## Time Budget

- ⏱ **0-5 min:** Try to fix yourself
- ⏱ **5-10 min:** Ask a teammate
- ⏱ **10-15 min:** Ask Claude Code
- ⏱ **15+ min:** ESCALATE (skip this bug, finish other features first)

---

## Ask Claude Code

```
"[What you tried] isn't working. Error: [error message]"

Claude will:
- Spot the bug you missed
- Suggest fix
- Verify it works
```

---

## Pro Tips

1. **Screenshot the error** - Copy exact error message
2. **Reproduce consistently** - "It always happens when I X" vs "Sometimes it fails"
3. **Check recent changes** - "It worked before I changed Y"
4. **Use browser DevTools** - Network tab shows exact API response
5. **Check logs** - Error message tells you more than guessing

---

## Why This Matters

- ✅ Systematic approach (not random guessing)
- ✅ 15-min time limit (don't waste time on hard bugs)
- ✅ Clear escalation path (Claude Code helps fast)
- ✅ Each bug type has clear fix strategy

**Result:** Bugs fixed in 5-15 min instead of 1 hour
