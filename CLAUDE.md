# Argus Hackathon 2026 - Team Development Guide

**Team Size:** 4 people
**Sprint Duration:** 8 hours
**Tech Stack:** React + TypeScript (Vite) frontend, Spring Boot 3 backend
**Goal:** Implement web app solution fast while maintaining quality

---

## 📋 Project Structure

```
argus-hackathon-2026-bots/
├── client/                 # React + TypeScript (Vite)
│   ├── src/
│   ├── package.json
│   ├── Dockerfile         # Dev & prod targets
│   └── frontend-rule.md   # Formatting rules
├── server/                 # Spring Boot 3 (Java 21)
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile         # Dev & prod targets
├── docker-compose.yml      # Full stack setup
├── .agents/
│   ├── skills/             # Custom skills
│   └── rules/              # Development rules
│       ├── backend-rule.md
│       ├── backend-quality.rule.md
│       ├── frontend-quality.md
│       └── frontend-rule.md
└── CLAUDE.md              # This file

**Ports:**
- Client (Vite): http://localhost:5173
- Server (Spring Boot): http://localhost:8086
```

---

## 📜 Development Rules (MANDATORY)

Strictly follow these rules for every task. They define our architectural standards and automated workflows.

### Backend Rules (server/)

- **Architecture & Patterns**: [.agents/rules/backend-rule.md](.agents/rules/backend-rule.md) - Recursive modular structure, DTO/Entity isolation, Java 21 records.
- **Code Quality & Formatting**: [.agents/rules/backend-quality.rule.md](.agents/rules/backend-quality.rule.md) - No manual formatting; use `./mvnw spotless:apply`.

### Frontend Rules (client/)

- **Architecture & Quality**: [.agents/rules/frontend-quality.md](.agents/rules/frontend-quality.md) - Feature-based structure, pure components, TanStack Query for state.
- **Formatting**: [client/frontend-rule.md](client/frontend-rule.md) - No manual formatting; use `npm run format`.

---

## ⚡ 8-Hour Hackathon Sprint Phases

### Phase 1: Problem Understanding (15-30 min)

When you receive the problem statement:

1. **Read & break down** requirements
2. **Use `writing-plans` skill**: Draft high-level architecture (frontend pages, API endpoints)
3. **Divide work** by frontend, backend, integration
4. **Assign tasks** to team members

### Phase 2: Planning & Setup (30-45 min)

1. **Use `writing-plans` skill**: Create detailed implementation plan with parallel tasks
2. **Use `dispatching-parallel-agents` skill**: Run subagents for each team member's area
3. **Create git branches** for isolated work
4. **Use `using-git-worktrees` skill**: Each person works in isolated worktree

### Phase 3: Implementation (5 hours)

**Per-person workflow:**

1. **Use `test-driven-development` skill**: Write test/acceptance criteria FIRST
2. **Use `executing-plans` skill**: Implement from the plan
3. **Use `verification-before-completion` skill**: Verify feature works before considering done
4. **Use `systematic-debugging` skill**: If tests fail, debug methodically

**Code Review (lightweight, continuous):**

- Every 30-45 min: **Use `requesting-code-review` skill** - Ask for a review
- The agent will spot bugs, suggest improvements, verify against requirements

### Phase 4: Integration & Polish (45 min)

1. **Merge branches** from all 4 team members
2. **Run full test suite**
3. **Use `verification-before-completion` skill**: Verify entire app works end-to-end
4. **Quick bug fixes** (use `systematic-debugging`)

---

## 🔄 Team Workflows (Critical for Hackathon)

### Workflow 1: API Contract Sync (T+30min - MUST DO)

**Goal:** Frontend & Backend agree on API shape BEFORE coding. Prevents "API doesn't match" disasters.

**When:** After problem statement is understood, before anyone codes.

**Who:** Frontend & Backend leads (whoever handles API integration + backend)

**Steps:**

1. **Agree on endpoints** (30 min)

   ```
   Backend team lists all APIs:
   - GET /api/users → returns User[]
   - POST /api/users → creates User → returns User
   - GET /api/users/:id → returns User

   Frontend team confirms:
   ✓ What data does frontend need?
   ✓ What order/format?
   ✓ Any extra fields needed?
   ```

2. **Document contract** (in code)

   ```typescript
   // shared/types.ts (or backend constants)
   export interface User {
     id: string;
     name: string;
     email: string;
     createdAt: string; // ISO format
   }

   export const API_ENDPOINTS = {
     GET_USERS: "/api/users",
     CREATE_USER: "/api/users",
     GET_USER: "/api/users/:id",
   };
   ```

3. **Test the contract** (before implementation)

   ```
   Backend team: Write API endpoint stub
   - Returns mock data in agreed format

   Frontend team: Write fetch hook
   - Calls API, parses response
   - Verify types match
   ```

4. **Implement behind the contract**
   ```
   Backend: Write real logic, keep response format same
   Frontend: Write UI, data is already correct format
   → Zero integration friction
   ```

**Quick Check at T+1h:**

- [ ] Frontend can fetch real API data
- [ ] Data renders without type errors
- [ ] No format surprises

**What goes wrong (and fix):**
| Problem | Cause | Fix |
|---------|-------|-----|
| "API returns object, frontend expects array" | No contract | Document NOW, backend adjust |
| "API returns 'userName', frontend expects 'name'" | Naming mismatch | Agree on field names NOW |
| "API response is missing field X" | Incomplete contract | Add to contract, backend implements |

**Use Agent:**

```
"Create API contract for [feature]"
→ Agent generates interface + endpoints
→ You copy to both frontend & backend
```

---

### Workflow 2: Debugging Workflow (When Things Break)

**Goal:** Find & fix bugs fast without wasting time on wrong diagnosis.

**When:** Test fails, app crashes, or feature doesn't work.

**Time limit:** 15 minutes max per bug (then ask for help)

**Decision Tree:**

```
BUG FOUND
  ↓
Is it a COMPILE ERROR? (Red squiggly lines in editor)
  ├─ YES → Fix syntax/types
  │         mvn clean compile OR npm run build
  │         ✓ Compiler tells you what's wrong
  │
  └─ NO → Continue...
           ↓
Is it a TEST FAILURE? (Test suite failing)
  ├─ YES → Check test output
  │         "Expected X, got Y"
  │         → Fix code OR test (but probably code)
  │         → Re-run test
  │         ✓ Quick & clear
  │
  └─ NO → Continue...
           ↓
Is it RUNTIME ERROR? (App crashes / "undefined" / 500 error)
  ├─ YES → Check error logs
  │         Frontend: Browser console (F12)
  │         Backend: Docker logs (docker compose logs server)
  │         ✓ Stack trace tells you line number
  │
  └─ NO → Continue...
           ↓
Is it FUNCTIONAL BUG? (App runs, feature doesn't work right)
  ├─ YES → Use DEBUGGING CHECKLIST below
  │
  └─ NO → Not sure what's wrong?
           Ask: "Why isn't [feature] working?"
           → Agent helps diagnose
```

**Functional Bug Debugging Checklist:**

1. **Isolate the problem** (What's the smallest failing case?)

   ```
   DON'T: "The whole app doesn't work"
   DO:    "When I click button X, Y doesn't happen"
   ```

2. **Check frontend first** (if it's a UI issue)

   ```
   - Open browser console (F12)
   - Look for red errors
   - Check network tab → API calls
   - Does request go out? Get response back?
   - Is response correct format?

   If response is wrong → Backend bug
   If response is right → Frontend bug
   ```

3. **Check backend** (if it's an API issue)

   ```
   - Test endpoint with curl/Postman
   curl http://localhost:8086/api/users

   - Does it return data?
   - Is format correct?
   - Any error messages in logs?

   docker compose logs server
   ```

4. **Check integration** (if both work separately)

   ```
   - Frontend calls wrong URL?
   - Frontend parses response wrong?
   - Backend returns wrong format?

   Test: Call API from frontend, console.log the response
   ```

**Ask for help if stuck:**

```
"[What you tried] isn't working. Error: [error message]"

The agent will:
- Spot the bug you missed
- Suggest fix
- Verify it works
```

**Time tracking:**

- ⏱ 0-5 min: Self-debug
- ⏱ 5-10 min: Ask teammate
- ⏱ 10-15 min: Ask Agent
- ⏱ 15+ min: ESCALATE (skip this bug, finish other features first)

---

### Workflow 3: Merge Workflow (Code Ready to Ship)

**Goal:** Merge code safely without breaking main branch.

**When:** Feature is complete, tested, and verified working.

**Who:** Feature developer (but checks run automatically)

**Pre-Merge Checklist:**

```
Before pushing to PR:

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

**Merge Steps:**

1. **Push branch**

   ```bash
   git push origin feature-name
   ```

2. **Create PR (Pull Request)**

   ```bash
   gh pr create \
     --title "Add login form" \
     --body "Closes issue #2. Tests: ✓ Pass"
   ```

3. **Request code review**

   ```
   Assign: 1 teammate
   Time: 5-15 min review

   Use Agent:
   "Review my [component/endpoint] for bugs"
   → Gets instant feedback
   ```

4. **Address feedback**

   ```
   If reviewer says "Fix X":
   - Make change
   - Re-test
   - Push again (same PR auto-updates)
   ```

5. **Merge**

   ```bash
   gh pr merge --squash   # Squash commits (clean history)
   # Delete branch after merge
   ```

6. **Verify on main**
   ```
   - Pull latest main
   - npm install / mvn install
   - Run full app: docker compose up
   - Smoke test: Feature still works?
   - ✓ All good → Feature shipped
   ```

**Code Review Template (Lightweight):**

Reviewer checks:

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

**Merge Conflicts (Avoid!):**

If conflict happens:

```
git merge origin/main
# Conflicts show up

Fix manually:
- Keep both changes if possible
- Ask teammate if unsure
- Re-test after fix

Prevent: Use worktrees (isolated branches)
```

**Timeline Example:**

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

**What can go wrong:**

| Problem             | Prevention                 | Fix                            |
| ------------------- | -------------------------- | ------------------------------ |
| Tests fail on main  | Run tests before push      | Revert merge, fix, re-merge    |
| Conflicts on merge  | Use worktrees              | Resolve manually, re-test      |
| Feature breaks main | Verify on main after merge | Hotfix immediately             |
| Merge takes 1+ hour | Lightweight review         | Skip perfection, focus on bugs |

---

## 👥 Team Coordination Strategy

### Parallel Work (Key for 8-hour sprint)

**Divide by layers:**

```
Frontend Pages & Components: React/TypeScript UI and page structure
Frontend API Integration & State: API hooks, data fetching, state management
Backend APIs & Controllers: REST endpoints and request handling
Backend Business Logic & Database: Service layer, business rules, data persistence
```

**Each person:**

- Works in own git worktree (isolated, zero conflicts)
- Uses `test-driven-development` skill (test first)
- Requests code review at checkpoints (use `requesting-code-review`)
- Merges to main only after verification

**Coordination checkpoints:**

- **T+1h:** Architecture review (request code review from teammates)
- **T+3h:** Integration test (check API contracts match)
- **T+5h:** Full feature test (end-to-end)
- **T+7h:** Cleanup & polish

---

## 🛠 Essential Skills for Hackathon (11 Total)

### ✅ Daily Use (Every Task)

| Skill                            | When to Use                 | Command                           |
| -------------------------------- | --------------------------- | --------------------------------- |
| `test-driven-development`        | Before writing ANY code     | Ask: "Write a test for [feature]" |
| `verification-before-completion` | Before marking feature done | Ask: "Verify [feature] works"     |
| `systematic-debugging`           | Test fails / app crashes    | Ask: "Debug: [error message]"     |

### ✅ Planning Phase

| Skill                         | When to Use                      | Command                            |
| ----------------------------- | -------------------------------- | ---------------------------------- |
| `writing-plans`               | Breaking down requirements       | Ask: "Create a plan for [feature]" |
| `dispatching-parallel-agents` | Dividing work for 4 people       | Ask: "Split into 4 parallel tasks" |
| `using-git-worktrees`         | Starting isolated feature branch | Run: `claude --worktree`           |

### ✅ Implementation Phase

| Skill                    | When to Use                      | Command                           |
| ------------------------ | -------------------------------- | --------------------------------- |
| `executing-plans`        | Following your plan step-by-step | Ask: "Implement task 1 from plan" |
| `requesting-code-review` | After completing a feature       | Ask: "Review my [component/API]"  |

### ✅ Team Workflows (Critical)

| Skill                   | When to Use                    | Command                                  |
| ----------------------- | ------------------------------ | ---------------------------------------- |
| `api-contract-workflow` | Syncing API shape (T+30min)    | Ask: "Create API contract for [feature]" |
| `debugging-workflow`    | Bugs found, need decision tree | Use the debugging workflow guide         |
| `merge-workflow`        | Code ready to ship to main     | Use the merge workflow guide             |

### ⏳ Optional (Use if needed)

| Skill                         | When to Use                                               | Command                                                 |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `brainstorming`               | Team is stuck on approach                                 | Ask: "How would you approach [problem]?"                |
| `receiving-code-review`       | Getting feedback (integrated into requesting-code-review) | Accept Claude's suggestions                             |
| `subagent-driven-development` | Advanced: Large projects with many tasks                  | Use `dispatching-parallel-agents` instead for hackathon |

---

## 🧪 Testing Strategy (Fast & Effective)

### For Frontend (React/TypeScript)

```typescript
// Write test FIRST (acceptance criteria)
// ✅ Component renders
// ✅ Button click calls API
// ✅ Data displays correctly

// Then implement to pass test
```

**Quick testing:**

- Use `npm run dev` to visually check component
- Use unit tests for logic
- Skip E2E for hackathon (too slow)

### For Backend (Spring Boot)

```java
// Test FIRST:
// ✅ GET /api/endpoint returns 200
// ✅ POST creates resource
// ✅ Business logic computes correctly

// Then implement
```

**Quick testing:**

- Use `mvn test` to run unit tests
- Use `curl` or Postman to test endpoints
- Run docker compose to test integration

### Integration Testing

- **Who:** API integration developer (frontend-backend sync)
- **When:** After both frontend & backend ready
- **How:** Manual test + automated test
- **Command:** Ask Claude to "Test [feature] end-to-end"

---

## 🔄 Git Workflow (Minimal Friction)

### For Hackathon (Simplified)

```bash
# Start feature (each team member does this for their assigned work)
claude --worktree my-feature

# Work in isolated branch
# ... make commits ...

# When ready to merge
git push origin my-feature
gh pr create                    # Create PR
# Request review from teammates
# Merge when approved
```

**Key rules:**

- ✅ One person per feature branch (no conflicts)
- ✅ Small commits (easy to revert if needed)
- ✅ Merge to main only when verified working
- ✅ Use PR/code review (catch bugs early)

**Merge strategy:**

- Squash commits before merging (clean history)
- Delete branch after merge

---

## 📝 Code Review Process (Lightweight)

### For Hackathon (15 min reviews, not perfection)

**Reviewer checks:**

1. ✅ Code works (passes tests)
2. ✅ No obvious bugs
3. ✅ Follows project structure
4. ✅ Comments if confusing

**NOT checking:**

- ❌ Perfect naming conventions
- ❌ Refactoring opportunities
- ❌ Performance micro-optimizations

**Use skill:** `requesting-code-review` - Claude reviews in 5 min

```
You: "Review this component for bugs"
Claude: "✅ Looks good, one small fix..."
You: Apply fix + merge
Total: 15 minutes
```

---

## 🔧 Development Commands

### Running the App

```bash
# Full stack (both client + server)
docker compose up

# Just client
docker compose up client

# Just server
docker compose up server
```

### Testing

```bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && mvn test

# Full integration
# Manual: Test in browser + Postman
```

### Building

```bash
# Frontend production build
cd client && npm run build

# Backend production build
cd server && mvn clean package
```

---

## 🚨 Common Hackathon Gotchas (Avoid These)

| Problem                      | Solution                                    |
| ---------------------------- | ------------------------------------------- |
| "API contract mismatch"      | Agree on API spec FIRST (use writing-plans) |
| "Merge conflicts at end"     | Use git worktrees (isolated work)           |
| "Tests fail, don't know why" | Use systematic-debugging skill              |
| "Feature half-done at T+7h"  | Verify BEFORE moving to next task           |
| "Code review takes 2 hours"  | Use lightweight review (5 min max)          |
| "One person blocks 3 others" | Good division = parallel unblocked work     |

---

## 💡 Pro Tips for 8-Hour Sprint

1. **Communicate early:** Agree on API contracts at T+30min
2. **Test often:** Don't accumulate bugs (catch at T+1h, T+3h, T+5h)
3. **Divide wisely:** Backend logic layer finishes first (less dependencies)
4. **Code review fast:** 5-15 min reviews catch 80% of bugs
5. **Don't over-engineer:** Good enough > perfect (it's hackathon)
6. **Use Agent:** For code review + debugging (saves hours)
7. **Commit small:** Easy to revert if something breaks

---

## 📚 Essential Skills Reference (18 Total)

**All custom skills are in** `.agents/skills/`
**Development rules:** `.agents/rules/`

- **Frontend:** [.agents/rules/frontend-quality.md](.agents/rules/frontend-quality.md), [.agents/rules/frontend-rule.md](.agents/rules/frontend-rule.md)
- **Backend:** [.agents/rules/backend-quality.rule.md](.agents/rules/backend-quality.rule.md)

**CORE (Use Every Task):**

- `test-driven-development` - RED-GREEN-REFACTOR cycle
- `verification-before-completion` - Verify before done
- `systematic-debugging` - Root cause analysis

**PLANNING & EXECUTION:**

- `writing-plans` - Create detailed implementation plans
- `executing-plans` - Follow plans systematically
- `dispatching-parallel-agents` - Divide work for 4 people
- `using-git-worktrees` - Isolated branches (zero conflicts)

**WORKFLOWS (Team-Critical):**

- `api-contract-workflow` - API contract sync (T+30min)
- `debugging-workflow` - Systematic bug diagnosis
- `merge-workflow` - Safe code merging

**CODE REVIEW:**

- `requesting-code-review` - Ask for feedback (lightweight, 5-15 min)

**OPTIONAL (Use if needed):**

- `brainstorming` - Generate ideas when stuck
- `subagent-driven-development` - Advanced delegation (use dispatching-parallel-agents instead for hackathon)

**FRONTEND-SPECIFIC:**

- 📖 **[.agents/rules/frontend-quality.md](.agents/rules/frontend-quality.md)** - Comprehensive React architecture, patterns, and best practices
- 📖 **[.agents/rules/frontend-rule.md](.agents/rules/frontend-rule.md)** - Frontend formatting & code style automation
- `react-component-development` - Pure component patterns, props design, state in components
- `react-state-management` - Decision tree for useState vs React Query vs Zustand
- `react-api-integration` - API contracts, client setup, React Query patterns
- `react-testing` - Component/hook testing by behavior, mocking, assertions
- `frontend-workflow` - 5-phase feature implementation (understand → setup → test → integrate → verify)

**BACKEND-SPECIFIC:**

- 📖 **[.agents/rules/backend-quality.rule.md](.agents/rules/backend-quality.rule.md)** - Backend formatting & code style automation
- Spring Boot 3 service layer patterns
- REST API design best practices
- Database/repository patterns

---

## 🎯 Success Metrics (Check at T+7h)

Before submitting, verify:

- ✅ App runs without crashes
- ✅ Core features from problem statement work
- ✅ No obvious bugs
- ✅ Clean git history (easy to review)
- ✅ README explains how to run it
- ✅ All team members contributed

---

## 🔗 Getting Help

When stuck, ask for help:

```
"[Problem]: [Error/Issue]"
→ Agent suggests solution + references relevant skill

Example:
"Test failing: API returns 404 but should return 200"
→ Agent asks clarifying questions
→ Agent suggests fix
→ You implement + verify
```

---

## 📞 Recommended Work Areas

For **8-hour sprint with 4 people**, divide work by layers:

| Work Area           | Focus                              | Required Skills                                   |
| ------------------- | ---------------------------------- | ------------------------------------------------- |
| **Frontend UI**     | Pages, components, styling         | `react-component-development`, `react-testing`    |
| **Frontend Integration** | Frontend ↔ Backend contract, hooks | `react-api-integration`, `react-state-management` |
| **Backend APIs**    | Controllers, routing, REST endpoints | (See backend skills)                              |
| **Backend Logic**   | Services, business logic, database | (See backend skills)                              |

**Frontend Teams:** Read [.agents/rules/frontend-quality.md](.agents/rules/frontend-quality.md) and use `frontend-workflow` skill to guide implementation.

**Backend Teams:** Read [.agents/rules/backend-quality.rule.md](.agents/rules/backend-quality.rule.md) for formatting requirements.

**Transition:** At T+5h, all shift to integration + bug fixes (everyone helps)

---

## ✨ Remember

This is a **hackathon**, not production. Optimize for:

1. **Speed** (ship something working)
2. **Teamwork** (divide work, no bottlenecks)
3. **Quality** (test + verify, catch bugs early)
4. **Fun** (go along with the vibe!)
