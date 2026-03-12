---
name: frontend-workflow
description: Use when implementing frontend features systematically - from setup to verification
---

# Frontend Workflow for AI Agents

## Overview

This workflow ensures frontend implementations are **complete, tested, and ready to merge** without debugging later.

**Core principle:** Setup first, code second, verify last. Don't skip verification.

---

## The Workflow (5 Phases)

```
Phase 1: Understand
  ├─ Read requirements
  ├─ Check API contract
  └─ Plan file structure

Phase 2: Setup
  ├─ Create folder structure
  ├─ Define types
  ├─ Create api.ts
  └─ Create hook skeleton

Phase 3: Test First (TDD)
  ├─ Write failing test
  ├─ Write minimal code
  └─ Watch it pass

Phase 4: Integrate
  ├─ Connect to API
  ├─ Handle errors
  └─ Add loading states

Phase 5: Verify
  ├─ Run in browser
  ├─ Check console
  ├─ Test with real API
  └─ Verify no bugs
```

---

## Phase 1: Understand (5-10 min)

### 1.1 Read the Requirement

```
Task: "Build a TaskList component that shows all tasks"

Break it down:
  - What data? Tasks from /api/tasks
  - What should render? List of tasks with title, status
  - What actions? Click to complete/delete task
  - Error handling? Show error message if API fails
  - Loading? Show spinner while fetching
```

### 1.2 Check API Contract

```typescript
// shared/api-contract.ts - agreed with backend

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

// Endpoints:
// GET /api/tasks → Task[]
// POST /api/tasks → (title, description) → Task
// PUT /api/tasks/:id → (updates) → Task
// DELETE /api/tasks/:id → 204 No Content
```

**If contract not defined:** Coordinate with backend team NOW.

### 1.3 Plan File Structure

```
features/tasks/
├── components/
│   ├── TaskList.tsx      # Main component
│   ├── TaskCard.tsx      # Single task item
│   ├── TaskForm.tsx      # Create/edit form
│   └── index.ts          # Exports
├── hooks/
│   ├── useTasks.ts       # Fetch all tasks
│   ├── useCreateTask.ts  # Create mutation
│   ├── useUpdateTask.ts  # Update mutation
│   └── useDeleteTask.ts  # Delete mutation
├── api.ts                # API calls
├── types.ts              # TypeScript interfaces
└── index.ts              # Feature exports
```

---

## Phase 2: Setup (5-15 min)

### 2.1 Create Folder Structure

```bash
mkdir -p src/features/tasks/{components,hooks}
touch src/features/tasks/{types,api,index}.ts
```

### 2.2 Define Types

```typescript
// features/tasks/types.ts
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
}
```

### 2.3 Create api.ts

```typescript
// features/tasks/api.ts
import apiClient from '@/services/apiClient'
import { Task, CreateTaskRequest, UpdateTaskRequest } from './types'

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await apiClient.get<Task[]>('/tasks')
  return data
}

export const createTask = async (req: CreateTaskRequest): Promise<Task> => {
  const { data } = await apiClient.post<Task>('/tasks', req)
  return data
}

export const updateTask = async (id: string, req: UpdateTaskRequest): Promise<Task> => {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, req)
  return data
}

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`)
}
```

### 2.4 Create Hook Skeletons

```typescript
// features/tasks/hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query'
import { getTasks } from '../api'

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })
}

// features/tasks/hooks/useCreateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api'

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// ... similar for useUpdateTask, useDeleteTask
```

### 2.5 Create index.ts for Clean Imports

```typescript
// features/tasks/index.ts
export { TaskList } from './components'
export { useTasks, useCreateTask } from './hooks'
export type { Task } from './types'
```

**Result:** Clean folder structure, types defined, hooks ready. All in 15 minutes.

---

## Phase 3: Test First (10-20 min)

### 3.1 Write Component Test

```typescript
// features/tasks/components/__tests__/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '../TaskCard'

const mockTask = {
  id: '1',
  title: 'Buy milk',
  description: 'From store',
  completed: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

test('renders task title', () => {
  render(<TaskCard task={mockTask} onDelete={() => {}} onUpdate={() => {}} />)
  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})

test('calls onDelete when delete button clicked', () => {
  const onDelete = jest.fn()
  render(<TaskCard task={mockTask} onDelete={onDelete} onUpdate={() => {}} />)

  fireEvent.click(screen.getByText('Delete'))
  expect(onDelete).toHaveBeenCalledWith('1')
})

test('calls onUpdate when complete button clicked', () => {
  const onUpdate = jest.fn()
  render(<TaskCard task={mockTask} onDelete={() => {}} onUpdate={onUpdate} />)

  fireEvent.click(screen.getByText('Complete'))
  expect(onUpdate).toHaveBeenCalledWith('1', { completed: true })
})
```

### 3.2 Watch Test Fail

```bash
npm test -- TaskCard.test.tsx
```

**Output:**
```
FAIL TaskCard.test.tsx
  ✕ renders task title (TypeError: TaskCard is not a component)
```

**Good!** Test fails because component doesn't exist yet.

### 3.3 Write Minimal Component

```typescript
// features/tasks/components/TaskCard.tsx
export interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
}

export const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  return (
    <div className="border rounded p-4">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => onUpdate(task.id, { completed: true })}>Complete</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  )
}
```

### 3.4 Watch Test Pass

```bash
npm test -- TaskCard.test.tsx
```

**Output:**
```
PASS TaskCard.test.tsx
  ✓ renders task title
  ✓ calls onDelete when delete button clicked
  ✓ calls onUpdate when complete button clicked
```

**Repeat for each component:**
- TaskList.tsx
- TaskForm.tsx
- useTasks hook

---

## Phase 4: Integrate (15-30 min)

### 4.1 Connect Component to Hook

```typescript
// features/tasks/components/TaskListContainer.tsx
import { useTasks, useDeleteTask, useUpdateTask } from '../hooks'
import { TaskList } from './TaskList'

export const TaskListContainer = () => {
  const { data: tasks, isLoading, error } = useTasks()
  const { mutate: deleteTask } = useDeleteTask()
  const { mutate: updateTask } = useUpdateTask()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <TaskList
      tasks={tasks || []}
      onDelete={deleteTask}
      onUpdate={updateTask}
    />
  )
}
```

### 4.2 Add Loading States

```typescript
export const TaskListContainer = () => {
  const { data: tasks, isLoading, error } = useTasks()
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  if (isLoading) {
    return <div className="spinner">Loading tasks...</div>
  }

  if (error) {
    return (
      <div className="error">
        <h3>Failed to load tasks</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      <TaskList
        tasks={tasks || []}
        onDelete={(id) => deleteTask(id)}
        isDeleting={isDeleting}
      />
    </div>
  )
}
```

### 4.3 Handle API Errors

```typescript
// features/tasks/api.ts
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data } = await apiClient.get<Task[]>('/tasks')
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
    }
    throw error
  }
}
```

### 4.4 Test API Integration

```typescript
// features/tasks/__tests__/integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskListContainer } from '../components/TaskListContainer'

// Mock the API
jest.mock('../api', () => ({
  getTasks: jest.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Task 1',
      description: 'Desc 1',
      completed: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]),
}))

test('TaskListContainer loads and displays tasks', async () => {
  const queryClient = new QueryClient()

  render(
    <QueryClientProvider client={queryClient}>
      <TaskListContainer />
    </QueryClientProvider>
  )

  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })
})
```

---

## Phase 5: Verify (10-15 min)

### 5.1 Run in Browser

```bash
npm run dev
```

**Manual test:**
- ✅ Component renders
- ✅ Data displays from API
- ✅ Buttons work
- ✅ No console errors

### 5.2 Check Browser Console

```
F12 → Console tab
Look for red errors
Check Network tab for API calls
Verify response matches types
```

### 5.3 Test with Real API

```bash
# Start backend
docker compose up server

# In browser:
# 1. Open http://localhost:5173
# 2. Open F12 → Network tab
# 3. Click "Load Tasks"
# 4. Check request/response format
# 5. Verify data displays correctly
```

### 5.4 Run Full Test Suite

```bash
npm test
```

**All green?** Verify complete.

### 5.5 Verify No Regressions

```bash
# Other features still work?
# Navigation still works?
# No console warnings?
```

---

## Common Workflow Issues (& Fixes)

| Issue | Cause | Fix |
|-------|-------|-----|
| "TypeError: Cannot read property X" | Props not typed | Define interface in types.ts |
| API returns 404 | Wrong endpoint | Check contract, verify backend |
| "Cannot find module" | Wrong import path | Use feature index.ts exports |
| Tests fail, don't know why | Component not testable | Ensure props, no side effects |
| "ReferenceError: apiClient not found" | Missing import | Add import at top of file |
| Component renders undefined | React Query not set up | Wrap in QueryClientProvider |
| Stale data after update | Not invalidating cache | Use queryClient.invalidateQueries |

---

## Decision Tree: When to Create Components

```
Do I need a component?
  ↓
Is it used in multiple places?
  ├─ YES → Create component
  │
  └─ NO → Only used once?
          ├─ YES → Inline (keep simple)
          │
          └─ NO → Create component anyway
                  (easier to test, reuse later)
```

---

## File Naming Conventions

```typescript
// Component files
TaskCard.tsx          // Exported component
TaskCard.test.tsx     // Unit tests
TaskCard.module.css   // Scoped styles (if needed)

// Hook files
useTasks.ts           // Custom hook
useTasks.test.ts      // Tests

// Utilities
formatDate.ts         // Helper function
formatDate.test.ts    // Tests

// Types
types.ts              // Type definitions (interface, enum)

// API
api.ts                // API calls

// Index (clean exports)
index.ts              // Feature exports
```

---

## Parallel Development Coordination

When multiple people build features:

```
Developer 1: Features/tasks
Developer 2: Features/dashboard
Developer 3: Features/auth
Developer 4: Shared components/api client

Each follows this workflow independently:
1. Setup types/api first (5 min)
2. Write tests (5 min)
3. Implement (15 min)
4. Verify (10 min)

→ Total: 35 min per feature
→ With 4 people: 4 features in 35 minutes
```

**Key:** API contract agreed at start. No surprises during integration.

---

## Verification Checklist (Before PR)

- [ ] All types defined in types.ts
- [ ] All API calls in api.ts
- [ ] All hooks in hooks/ folder
- [ ] Components receive props (pure functions)
- [ ] No API calls in components
- [ ] Tests written and passing
- [ ] TypeScript compiles without warnings
- [ ] No console errors/warnings
- [ ] Tested in browser with real API
- [ ] Handles loading state
- [ ] Handles error state
- [ ] No prop drilling beyond 2 levels
- [ ] Follows file naming conventions
- [ ] No cross-feature imports
- [ ] Exports clean via index.ts

---

## Time Breakdown (Per Feature)

| Phase | Time | Activity |
|-------|------|----------|
| Understand | 5 min | Read requirements, check contract |
| Setup | 10 min | Create folders, types, api.ts, hooks |
| Test | 10 min | Write tests, watch fail, implement |
| Integrate | 15 min | Connect components, handle errors |
| Verify | 10 min | Run in browser, test with API |
| **Total** | **50 min** | One complete feature |

---

## Example: Full Feature (Copy & Adapt)

```
Task: Build a TaskList feature

Step 1: Setup (10 min)
  → mkdir -p features/tasks/{components,hooks}
  → Create types.ts with Task interface
  → Create api.ts with getTasks, createTask, etc.
  → Create hooks: useTasks.ts, useCreateTask.ts

Step 2: Tests (5 min)
  → TaskCard.test.tsx: render, click handlers
  → TaskList.test.tsx: render array, empty state
  → useTasks.test.tsx: data loading, error

Step 3: Implement (15 min)
  → TaskCard.tsx - pure component
  → TaskList.tsx - map over tasks
  → TaskListContainer.tsx - fetch and display

Step 4: Verify (10 min)
  → npm run dev
  → Test in browser
  → Check F12 console
  → Verify API calls work

Total: 40 minutes → Feature shipped
```

---

## When Stuck

| Stuck On | Ask |
|----------|-----|
| "Don't know how to structure this" | "What's the data shape? Create types first." |
| "Tests are too complicated" | "Split into smaller components. Tests should be simple." |
| "API contract undefined" | "Ask backend team NOW. Don't guess." |
| "Component won't render" | "Check props. Are they typed? Check React DevTools." |
| "API calls failing" | "Test endpoint with curl. Check backend logs." |
| "Stale data displayed" | "Use React Query invalidation." |

---

## Pro Tips

1. **Setup first, code second** - 15 min setup saves 1 hour debugging
2. **Test before implement** - TDD prevents bugs
3. **Verify with real API** - Mock data hides bugs
4. **Communicate types early** - API contract prevents disasters
5. **Keep components simple** - Under 100 lines each
6. **Don't skip error handling** - Users need feedback
7. **Use React Query** - Don't reinvent caching
8. **One feature per folder** - Easy to find, no conflicts

