---
name: react-state-management
description: Use when deciding how to manage state, choosing between useState, React Query, Zustand, and Context API
---

# React State Management

## Overview

State management is about answering: **Where should this data live?**

The wrong choice creates bugs, makes refactoring hard, and slows down the app. Use the decision tree below.

---

## State Decision Tree

```
Do I need to store data?
  ↓
Is it from an API / server?
  ├─ YES → Use React Query
  │        (caching, refetching, background sync)
  │
  └─ NO → Continue...
          ↓
Do multiple unrelated components need it?
  ├─ YES → Use Zustand (global state)
  │        (theme, user auth, UI preferences)
  │
  └─ NO → Continue...
          ↓
Is it UI state (form, modal, filter)?
  └─ YES → Use useState (local state)
           (form input, open/close, current tab)
```

---

## Server State: React Query

**When:** Data from APIs (tasks, users, posts, etc.)

### Setup

```bash
npm install @tanstack/react-query
```

```typescript
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)
```

### Fetching Data

✅ Good:
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

if (isLoading) return <Loading />
if (error) return <Error message={error.message} />

return <TaskList tasks={tasks} />
```

❌ Bad:
```typescript
const [tasks, setTasks] = useState(null)
useEffect(() => {
  getTasks().then(setTasks)
}, [])
```

**Why React Query is better:**
- Automatic caching
- Refetch in background
- Stale-while-revalidate pattern
- Deduplicates requests
- Handles race conditions

### Creating Data

```typescript
// features/tasks/hooks/useCreateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api'

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Refetch tasks after creating
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// Usage:
const { mutate: create, isPending } = useCreateTask()

const handleSubmit = async (data) => {
  create(data)
}

<button disabled={isPending}>
  {isPending ? 'Creating...' : 'Create Task'}
</button>
```

### Pagination

```typescript
export const useTasksPaginated = (page: number) => {
  return useQuery({
    queryKey: ['tasks', page],
    queryFn: () => getTasksPaginated(page),
  })
}

// Each page is cached separately
```

### Filtering / Search

```typescript
export const useTasksFiltered = (filter: string) => {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => getTasksFiltered(filter),
  })
}

// New filter = new cache
// Old filter data still available
```

### Dependent Queries

```typescript
// Fetch user first, then tasks for that user
export const useUserWithTasks = (userId: string) => {
  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => getTasks(userId),
    enabled: !!userQuery.data,  // Only run if user loaded
  })

  return { user: userQuery.data, tasks: tasksQuery.data }
}
```

---

## Global UI State: Zustand

**When:** State many unrelated components need (theme, user auth, UI prefs)

### Setup

```bash
npm install zustand
```

### Creating a Store

```typescript
// src/store/themeStore.ts
import create from 'zustand'

export interface ThemeState {
  isDark: boolean
  toggle: () => void
  set: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggle: () => set((state) => ({ isDark: !state.isDark })),
  set: (isDark) => set({ isDark }),
}))
```

### Using the Store

```typescript
// Any component
const { isDark, toggle } = useThemeStore()

return (
  <button onClick={toggle}>
    {isDark ? 'Light mode' : 'Dark mode'}
  </button>
)
```

### Auth Store Example

```typescript
// src/store/authStore.ts
import create from 'zustand'

export interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  token: localStorage.getItem('token'),

  setUser: (user) => {
    set({ user })
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}))

// Usage:
const { user, logout } = useAuthStore()

if (!user) return <LoginPage />
return <UserMenu user={user} onLogout={logout} />
```

### Persisting State

```typescript
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserPreferences = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'user-preferences',  // localStorage key
    }
  )
)
```

### When NOT to Use Zustand

❌ Don't:
```typescript
// API data in Zustand (use React Query)
const useTasksStore = create((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const data = await getTasks()
    set({ tasks: data })
  },
}))
```

---

## Local UI State: useState

**When:** Single component needs state (form input, open/close modal, current tab)

### Form State

```typescript
export const ContactForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, message })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  )
}
```

### Modal State

```typescript
export const DeleteConfirmModal = ({
  item,
  onDelete,
}: {
  item: Task
  onDelete: () => void
}) => {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      setOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>Delete</button>

      {open && (
        <div className="modal">
          <h3>Delete "{item.title}"?</h3>
          <p>This cannot be undone.</p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  )
}
```

### Simplified with useReducer (Complex State)

```typescript
interface FilterState {
  search: string
  category: string
  sortBy: 'date' | 'name'
  limit: number
}

type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'RESET' }

const initialState: FilterState = {
  search: '',
  category: '',
  sortBy: 'date',
  limit: 10,
}

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const FilteredList = () => {
  const [filter, dispatch] = useReducer(filterReducer, initialState)

  return (
    <div>
      <input
        value={filter.search}
        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
```

---

## Context API (Rarely Needed)

**When:** Need to pass deeply nested data without prop drilling.

**Usually:** Use Zustand instead (simpler, better performance).

```typescript
// Only if you really need it:
interface Theme {
  isDark: boolean
  toggle: () => void
}

const ThemeContext = React.createContext<Theme | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false)

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(!isDark) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
```

**Better:** Use Zustand instead.

---

## State Location Decision Matrix

| State | Type | Location | Library |
|-------|------|----------|---------|
| Tasks from API | Server | React Query | `@tanstack/react-query` |
| Current user | Server + Global | React Query + Zustand | Both |
| Theme (dark/light) | UI | Global | Zustand |
| User preferences | UI + Persisted | Zustand | Zustand |
| Form input | UI | Local | useState |
| Modal open/close | UI | Local | useState |
| Current tab | UI | Local | useState |
| Search filter | UI | Local or URL | useState |
| Pagination page | UI | URL or local | useState |

---

## Best Practices

### 1. Keep State Close to Where It's Used

✅ Good:
```typescript
// Modal state in the component that opens it
export const MyFeature = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
```

❌ Bad:
```typescript
// Modal state in global Zustand (overkill)
const useModalStore = create((set) => ({
  isModalOpen: false,
  toggle: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
}))
```

### 2. Don't Over-Globalize

```typescript
// ❌ Bad - puts everything in Zustand
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  sidebarOpen: true,
  currentTab: 0,
  formData: {},
  filters: {},
  isLoading: false,
  // ... 20 more things
}))

// ✅ Good - separate concerns
const useAuthStore = create((set) => ({ user: null }))
const useThemeStore = create((set) => ({ theme: 'light' }))
const useUIStore = create((set) => ({ sidebarOpen: true }))
```

### 3. Combine React Query + Zustand

```typescript
// React Query for server state
const { data: tasks } = useTasks()

// Zustand for UI state
const { sidebarOpen, toggleSidebar } = useUIStore()

// Local state for forms
const [filter, setFilter] = useState('')
```

### 4. Avoid Prop Drilling with Composition

```typescript
// Instead of passing props 5 levels deep...
<Layout>
  <Sidebar>
    <TaskSection>
      <TaskList>
        <TaskCard task={task} />
      </TaskList>
    </TaskSection>
  </Sidebar>
</Layout>

// ...extract component and use hooks
export const TaskCardWithHooks = () => {
  const { task } = useTaskContext()  // From React Query
  return <TaskCard task={task} />
}
```

---

## Common Mistakes

| Mistake | Why Bad | Fix |
|---------|--------|-----|
| API data in useState | No caching, refetching | Use React Query |
| Everything in Zustand | Bloated store, hard to reason | Use multiple stores + useState |
| Global state in Context | Performance issues with large trees | Use Zustand instead |
| Not using dependency arrays | Memory leaks, stale data | Always list dependencies |
| Mutating state directly | React can't detect changes | Use updater functions |

---

## Quick Reference

```typescript
// Server data from API
const { data, isLoading, error } = useQuery(...)  // React Query

// Global UI state
const { isDark, toggle } = useThemeStore()  // Zustand

// Single component state
const [isOpen, setIsOpen] = useState(false)  // useState

// Complex local logic
const [state, dispatch] = useReducer(reducer, initialState)  // useReducer
```

---

## Verification Checklist

Before considering state management done:

- [ ] Server data uses React Query
- [ ] Global state uses Zustand (if needed)
- [ ] Local state uses useState
- [ ] No prop drilling beyond 2-3 levels
- [ ] TypeScript compiles without warnings
- [ ] No API calls in effects (use React Query)
- [ ] Stores/queries have clear purpose
- [ ] Tests pass

