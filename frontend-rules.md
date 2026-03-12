# Frontend Rules & Patterns (React + TypeScript)

**Audience:** Claude, Gemini, and all AI agents working on this frontend

These rules optimize for **speed, clarity, and parallel development** in an 8-hour hackathon.

---

## 🏗 Architecture Rules (Non-Negotiable)

### Rule 1: Feature-Based Folder Structure

```
src/
├── features/          # Business logic, isolated by feature
│   ├── auth/
│   ├── dashboard/
│   └── [problemFeature]/
├── components/        # Shared UI only
├── hooks/            # Shared utilities
├── services/         # API clients, auth service
├── store/           # Global state (if needed)
├── types/           # Global TypeScript types
└── styles/          # Global styles
```

**Why:** Each teammate owns a feature folder. Zero merge conflicts on random files.

### Rule 2: Features Must Be Self-Contained

✅ Allowed:
```typescript
// In features/auth/
import { apiClient } from '@/services/apiClient'
import { Button } from '@/components/ui/Button'
import { useAuth } from './hooks/useAuth'
```

❌ NOT allowed:
```typescript
// In features/auth/
import { LoginForm } from '@/features/dashboard'  // Cross-feature import
```

**Why:** Features can be developed in parallel. Cross-feature imports create merge conflicts and dependencies.

### Rule 3: API Logic Stays in services/ or api.ts

✅ Good:
```typescript
// features/tasks/api.ts
import apiClient from '@/services/apiClient'

export const getTasks = () => apiClient.get('/tasks')
export const createTask = (data) => apiClient.post('/tasks', data)

// features/tasks/hooks/useTasks.ts
import { getTasks } from '../api'
export const useTasks = () => useQuery(['tasks'], getTasks)

// features/tasks/components/TaskList.tsx
const { data: tasks } = useTasks()
```

❌ Bad:
```typescript
// features/tasks/components/TaskList.tsx
const TaskList = () => {
  useEffect(() => {
    axios.get('/tasks')  // API call directly in component
  }, [])
}
```

**Why:** API logic in components = untestable, unmaintainable, hard to reuse.

### Rule 4: Components Are UI Only

✅ Good:
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
)
```

✅ Also good:
```typescript
// features/tasks/components/TaskList.tsx
interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
}

export const TaskList = ({ tasks, onDelete }: TaskListProps) => (
  <ul>
    {tasks.map(task => (
      <TaskItem key={task.id} task={task} onDelete={onDelete} />
    ))}
  </ul>
)
```

❌ Bad:
```typescript
// features/tasks/components/TaskList.tsx
export const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const handleDelete = async (id) => {
    await apiClient.delete(`/tasks/${id}`)  // Business logic in component
    setTasks(tasks.filter(t => t.id !== id))
  }
  // ...
}
```

**Why:** Components + business logic = hard to test, hard to reuse, tightly coupled.

### Rule 5: Always Define Types for API Responses

✅ Good:
```typescript
// features/tasks/types.ts
export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string  // ISO format from backend
}

// features/tasks/api.ts
import { Task } from './types'

export const getTasks = (): Promise<Task[]> =>
  apiClient.get('/tasks')
```

❌ Bad:
```typescript
// features/tasks/api.ts
export const getTasks = () => apiClient.get('/tasks')  // No types
```

**Why:** Prevents "undefined property" bugs. Helps during fast development.

---

## 📦 Component Patterns

### Components Receive Props, Not Dependencies

❌ Bad:
```typescript
export const UserProfile = ({ userId }: { userId: string }) => {
  const user = useUser(userId)  // Hook inside, hard to test
  return <div>{user.name}</div>
}
```

✅ Good:
```typescript
export interface UserProfileProps {
  user: User
}

export const UserProfile = ({ user }: UserProfileProps) => (
  <div>{user.name}</div>
)
```

**Why:** Components are pure functions. Easier to test, reuse, and reason about.

### Compound Components for Complex UI

```typescript
// components/ui/Modal.tsx
export const Modal = {
  Root: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open && <div className="modal">{children}</div>
  ),
  Header: ({ title }: { title: string }) => <h2>{title}</h2>,
  Body: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Footer: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
}

// Usage:
<Modal.Root open={showModal}>
  <Modal.Header title="Confirm" />
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button onClick={onConfirm}>Yes</Button>
  </Modal.Footer>
</Modal.Root>
```

**Why:** Flexible, readable, and doesn't require large prop objects.

---

## 🪝 Hooks Patterns

### Create Feature-Specific Hooks

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

// Usage:
const { data: tasks, isLoading, error } = useTasks()
```

**Why:** Encapsulates API logic. Reusable across components in the feature.

### Use React Query for Server State

```typescript
// ✅ Use React Query for data from APIs
const { data: user, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
})

// ✅ Use useState for UI state
const [isModalOpen, setIsModalOpen] = useState(false)

// ❌ DON'T use useState for data from APIs
const [user, setUser] = useState(null)
useEffect(() => {
  getUser(userId).then(setUser)
}, [userId])
```

**Why:** React Query handles caching, refetching, and error states automatically.

### Extract Complex Logic to Custom Hooks

```typescript
// features/auth/hooks/useLogin.ts
export const useLogin = () => {
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const response = await apiClient.post('/auth/login', { email, password })
      localStorage.setItem('token', response.token)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { login, error }
}
```

**Why:** Reusable, testable, and keeps components simple.

---

## 🎨 Styling Rules

### Use Tailwind CSS Classes

```typescript
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click me
</button>

// ❌ Avoid inline styles
<button style={{ padding: '0.5rem 1rem', backgroundColor: 'blue' }}>
  Click me
</button>
```

**Why:** Consistent, fast to write, easy to maintain.

### Use CSS Modules for Complex Styles

```typescript
// features/tasks/components/TaskCard.module.css
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

// features/tasks/components/TaskCard.tsx
import styles from './TaskCard.module.css'

export const TaskCard = ({ task }: { task: Task }) => (
  <div className={styles.card}>{task.title}</div>
)
```

**Why:** Scoped styles prevent naming conflicts. Good for complex styling.

### Shadcn/ui for UI Components

```typescript
// ✅ Use shadcn/ui for standard components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Don't build from scratch
```

**Why:** Pre-built, styled, accessible. Saves 30+ minutes per component.

---

## 🧪 Testing Rules

### Test Components by Props

✅ Good:
```typescript
test('displays user name when provided', () => {
  const user = { id: '1', name: 'Alice' }
  render(<UserProfile user={user} />)
  expect(screen.getByText('Alice')).toBeInTheDocument()
})
```

❌ Bad:
```typescript
test('fetches user', async () => {
  jest.mock('./api')
  render(<UserProfile userId="1" />)
  // Testing mock behavior, not component
})
```

**Why:** Testing props is testing behavior. Testing mocks tests your mock setup.

### Test Hooks with react-testing-library

```typescript
test('useTasks returns tasks', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useTasks())

  await waitForNextUpdate()

  expect(result.current.data).toEqual([
    { id: '1', title: 'Task 1' },
    { id: '2', title: 'Task 2' },
  ])
})
```

**Why:** Hooks are testable. Don't mock useQuery if you can use real data.

### Skip E2E Tests in Hackathon

- ❌ Cypress / Playwright (too slow for 8 hours)
- ✅ Unit tests + manual testing (fast + effective)

**Why:** Unit tests run in seconds. E2E tests run in minutes. Hackathon = minutes matter.

---

## 🔄 State Management Rules

### Start Simple: Props + useState

```typescript
// features/auth/components/LoginForm.tsx
export const LoginForm = ({ onLogin }: { onLogin: (credentials) => void }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

**When:** Single component or parent-child communication.

### Use React Query for Server State

```typescript
// features/tasks/hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query'

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })
}
```

**When:** Data from APIs that needs caching, refetching, background updates.

### Use Zustand for Global UI State (Only if Needed)

```typescript
// store/themeStore.ts
import create from 'zustand'

export const useThemeStore = create((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
}))

// Any component:
const { isDark, toggle } = useThemeStore()
```

**When:** Global state that many unrelated components need (theme, user auth status).

**Don't use for:** Local state (form inputs), API data (use React Query).

---

## 🚀 Performance Rules

### Memoize Components Only When Necessary

✅ Good:
```typescript
// Use memo only for expensive renders with same props
export const TaskCard = React.memo(({ task }: { task: Task }) => (
  <div>{task.title}</div>
))
```

❌ Over-optimization:
```typescript
// Memo every component (premature optimization)
export const Button = React.memo(({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
))
```

**Why:** Memo has cost. Use only when profiling shows bottleneck.

### Avoid useCallback/useMemo When Props Change Often

❌ Bad:
```typescript
const handleClick = useCallback(() => {
  setCount(count + 1)
}, [count])  // Re-memoizes on every render anyway
```

✅ Good:
```typescript
const handleClick = () => {
  setCount(count + 1)
}
```

**Why:** If dependency changes every render, useCallback adds cost without benefit.

### Lazy Load Routes

```typescript
// app/routes.tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('@/features/dashboard'))
const Tasks = lazy(() => import('@/features/tasks'))

export const routes = [
  { path: '/dashboard', element: <Suspense fallback={<Loading />}><Dashboard /></Suspense> },
  { path: '/tasks', element: <Suspense fallback={<Loading />}><Tasks /></Suspense> },
]
```

**Why:** Initial bundle smaller. Users see app faster.

---

## 🐛 Debugging Rules

### Check Browser Console First

```
F12 → Console
Look for red errors
Check Network tab for API calls
```

### Use React DevTools

```
F12 → React DevTools tab
Inspect component props
Check hook state
Profile renders
```

### Isolate the Problem

❌ "The whole app doesn't work"
✅ "When I click button X, it shows error Y"

### Call API with curl to Debug

```bash
# Backend working?
curl http://localhost:8086/api/tasks

# Response correct format?
# Then bug is in frontend
```

---

## 📋 Pre-Implementation Checklist

Before coding, verify:

- [ ] Types defined for API responses
- [ ] API contract agreed with backend team
- [ ] Folder structure created (feature/components/api.ts)
- [ ] Hook skeletons created (useFeature, useFeatureData)
- [ ] Test file created (matching .test.tsx)
- [ ] Component props interface defined

**Time:** 5 minutes. Prevents "type errors" later.

---

## 🔗 API Contract Sync (Critical)

**MUST DO at T+30min**

Backend and frontend agree on response format BEFORE coding:

```typescript
// shared/api-contract.ts (or backend constants)
export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string  // ISO format
}

export const ENDPOINTS = {
  TASKS: '/api/tasks',
  CREATE_TASK: '/api/tasks',
  UPDATE_TASK: '/api/tasks/:id',
  DELETE_TASK: '/api/tasks/:id',
}
```

**Test the contract immediately:**
```typescript
// frontend/api.ts
export const getTasks = (): Promise<Task[]> =>
  apiClient.get(ENDPOINTS.TASKS)

// backend/Controller.java
@GetMapping("/api/tasks")
public List<TaskResponse> getTasks() {
  return taskService.getAllTasks()  // Returns Task[]
}
```

**Check:** Frontend calls API, data parses correctly. Zero integration friction.

---

## 🎯 Common Mistakes (Avoid These)

| Mistake | Prevention |
|---------|-----------|
| API call in component | Write API logic in `api.ts` |
| Props not typed | Define `interface ComponentProps` |
| Cross-feature imports | Use `services/` or `components/` instead |
| No types for API response | Define `interface Task` in `types.ts` |
| useState for server data | Use React Query instead |
| Mocking everything | Test with real data when possible |
| Tests pass immediately | Watch test fail first (TDD) |
| Component does too much | Split into smaller components |
| No error handling | Show error states to user |
| Forget to rebuild after changes | `npm run dev` watches changes |

---

## ⚡ Fast Frontend Setup (Pre-Create These)

Before hackathon starts, create stubs:

```typescript
// src/services/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8086/api',
})

export default apiClient

// src/types/index.ts
// Add types as you build

// src/app/routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export const AppRoutes = () => (
  <Routes>
    {/* Routes go here */}
  </Routes>
)

// src/store/index.ts
// Global state goes here if needed
```

---

## 📖 Summary

**For AI agents building React:**

1. ✅ Features are self-contained (no cross-feature imports)
2. ✅ API logic in `api.ts` + hooks, never in components
3. ✅ Components receive props (pure functions)
4. ✅ Define types for everything (prevents bugs)
5. ✅ Use React Query for server state
6. ✅ Use Tailwind + shadcn/ui for UI
7. ✅ Test with props, not mocks
8. ✅ Sync API contract with backend at T+30min
9. ✅ TDD: Red → Green → Refactor
10. ✅ Keep components simple and focused

**Break these rules?** Code becomes slow, buggy, hard to test, hard to merge.

