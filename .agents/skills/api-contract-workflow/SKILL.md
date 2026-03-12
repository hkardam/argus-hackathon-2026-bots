---
name: api-contract-workflow
description: Use when frontend and backend teams need to agree on API shape before implementation to prevent integration mismatches
---

# API Contract Workflow

## Overview

Establish API contracts early to prevent "API doesn't match" disasters. Frontend and backend teams agree on endpoint shape, data types, and response formats BEFORE either side codes.

## When to Use

- **T+30min** in hackathon sprint (right after understanding requirements)
- Before frontend writes fetch hooks
- Before backend writes endpoints
- When starting any new feature with frontend/backend dependencies

**Symptoms you need this:**
- "We're not sure what the API should return"
- "Frontend and backend are coding APIs independently"
- "API response doesn't match what frontend expects"

## Quick Process

1. **List endpoints** - Backend Person lists what will be built
2. **Confirm needs** - Frontend Person asks: data needed? format? error cases?
3. **Document contract** - Write TypeScript interfaces + endpoints
4. **Stub & test** - Backend stubs endpoint, frontend tests with real types
5. **Implement behind contract** - Both sides add real logic without changing response format

## Core Principle

**Contract First, Implementation Second**

Agree on the shape, then code behind it. This prevents the last-hour "API doesn't match UI" integration hell.

## Example

```typescript
// Agree on this FIRST:
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

// Then implement:
// Backend: Write POST /api/users to create User
// Frontend: Write useUsers() hook to fetch User[]
// → Both work immediately, zero integration friction
```

## Timeline

```
T+0h30min: Agree on endpoints
T+0h45min: Document contract
T+1h00min: Verify contract works (frontend calls stub API)
T+2h00min: Implement real logic behind contract
→ Zero integration issues
```

## Full Workflow

See: `workflows/1-api-contract-workflow.md`

## Use Claude Code

```
"Create API contract for [feature]"
→ Claude generates types + endpoints
→ Copy to both sides

"Help me design the API for [feature]"
→ Claude suggests structure
→ You document as contract
```

## Common Mistakes

- ❌ "Let's design API as we go" → Integration hell at T+6h
- ❌ "Frontend will work around API differences" → More code, more bugs
- ❌ "We'll merge formats in the UI" → Data transformation everywhere

## Result

✅ Zero integration friction
✅ Parallel work (both sides ready day 1)
✅ Tests use real types (mock with correct shape)
✅ Save 1+ hour of debugging at end of sprint
