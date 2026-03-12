# Workflow 1: API Contract Sync (T+30min)

**Goal:** Frontend & Backend agree on API shape BEFORE coding. Prevents "API doesn't match" disasters.

**When:** After problem statement is understood, before anyone codes.

**Who:** Person 2 (API Integration Lead) + Person 3 (Backend Lead)

**Duration:** 30 minutes

---

## Quick Steps

1. **Agree on endpoints** (Backend lists what Person 3 will build)
   ```
   - GET /api/users → returns User[]
   - POST /api/users → creates User → returns User
   - GET /api/users/:id → returns User
   ```

2. **Frontend confirms needs** (Person 2 asks questions)
   - ✓ What data does frontend need?
   - ✓ What order/format?
   - ✓ Any extra fields?
   - ✓ Error responses (400, 401, 404)?

3. **Document contract in code**
   ```typescript
   // shared/types.ts (or backend constants)
   export interface User {
     id: string;
     name: string;
     email: string;
     createdAt: string;  // ISO format
   }

   export const API_ENDPOINTS = {
     GET_USERS: '/api/users',
     CREATE_USER: '/api/users',
     GET_USER: '/api/users/:id',
   };
   ```

4. **Test the contract** (stub before real implementation)
   - Backend: Write mock endpoint (returns dummy data in agreed format)
   - Frontend: Write fetch hook (calls API, verify types match)

5. **Implement behind the contract**
   - Backend: Write real logic, keep response format same
   - Frontend: Write UI, data is already correct type

---

## Verification Checklist (T+1h)

- [ ] Frontend can fetch real API data
- [ ] Data renders without type errors
- [ ] No format surprises

---

## Common Mistakes

| Problem | Cause | Fix |
|---------|-------|-----|
| "API returns object, frontend expects array" | No contract | Document NOW, backend adjust |
| "API returns 'userName', frontend expects 'name'" | Naming mismatch | Agree on field names NOW |
| "API response is missing field X" | Incomplete contract | Add to contract, backend implements |
| "Can't call API from frontend" | Wrong endpoint URL | Check contract, verify both sides match |

---

## Ask Claude Code

```
"Create API contract for [feature]"
→ Claude generates interface + endpoints
→ Copy to both frontend & backend
```

Or:

```
"Help me design the API for user authentication"
→ Claude suggests structure
→ You document as contract
```

---

## Why This Matters for Hackathon

- ✅ Zero integration friction (both sides work from day 1)
- ✅ Parallel work (each person knows exact API shape)
- ✅ No last-hour surprises ("API doesn't match!")
- ✅ Tests can mock API with real types

**Result:** Save 1+ hour of debugging integration at T+6h
