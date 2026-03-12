---
name: debugging-workflow
description: Use when tests fail, app crashes, or features don't work - follow systematic approach to diagnose and fix bugs quickly
---

# Debugging Workflow

## Overview

Find & fix bugs fast using a systematic decision tree. Don't waste time on wrong diagnosis.

## When to Use

- Test fails or app crashes
- Feature doesn't work as expected
- "Something is broken but I don't know what"

**Symptoms:**
- Red compiler errors
- Test assertions failing
- Runtime crashes (500 errors, undefined errors)
- Feature works sometimes, not others
- Data displays wrong

## Decision Tree (Follow This)

```
Is it a COMPILE ERROR? (Red squiggly lines)
  ├─ YES → Compiler tells you exactly. Fix it.
  └─ NO → Continue...

Is it a TEST FAILURE? ("Expected X, got Y")
  ├─ YES → Fix code to pass test
  └─ NO → Continue...

Is it a RUNTIME ERROR? (App crashes, 500 error)
  ├─ YES → Check logs (browser console F12 or docker logs)
  └─ NO → Continue...

Is it FUNCTIONAL? (App runs, feature doesn't work right)
  ├─ YES → Use CHECKLIST below
  └─ NO → Ask Claude Code
```

## Functional Bug Checklist

1. **Isolate the problem**
   ```
   DON'T: "The whole app doesn't work"
   DO:    "When I click button X, Y doesn't happen"
   ```

2. **Check frontend** (if UI issue)
   - Browser console (F12): Any red errors?
   - Network tab: Does API request go out? Response come back?
   - Response format: Does it match expected type?
   - Result: Frontend bug or backend bug?

3. **Check backend** (if API issue)
   ```bash
   curl http://localhost:8086/api/users
   docker compose logs server
   ```
   - Endpoint returns data?
   - Format correct?
   - Errors in logs?

4. **Check integration**
   - Frontend URL matches backend endpoint?
   - Frontend parsing response correctly?
   - Backend returning agreed contract format?

## Time Budget (15 min max)

- ⏱ **0-5 min:** Try to fix yourself
- ⏱ **5-10 min:** Ask teammate
- ⏱ **10-15 min:** Ask Claude Code
- ⏱ **15+ min:** ESCALATE (skip bug, finish other features)

## Ask Claude Code

```
"[What you tried] isn't working. Error: [error message]"

Claude will:
- Spot the bug you missed
- Suggest fix
- Verify it works
```

## Pro Tips

1. **Copy exact error message** - Not just "it doesn't work"
2. **Reproduce consistently** - "Always happens when I X"
3. **Check recent changes** - "It worked before I changed Y"
4. **Use DevTools** - Network tab shows exact API response
5. **Check logs** - Error message tells you everything

## Full Workflow

See: `workflows/2-debugging-workflow.md`

## Common Patterns

| Type | Symptom | Check First |
|------|---------|-------------|
| Frontend bug | UI doesn't update | Browser console errors? |
| Backend bug | API returns wrong data | Backend logs + curl test |
| Integration bug | Works separately, broken together | URL match? Data format match? |
| Type bug | "undefined" errors | Missing API field? |

## Result

✅ Bugs fixed in 5-15 min (not 1 hour)
✅ Systematic approach (not random guessing)
✅ Clear escalation path (Claude Code helps)
✅ Time to move on to next feature
