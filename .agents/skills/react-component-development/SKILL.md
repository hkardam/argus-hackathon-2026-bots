---
name: react-component-development
description: Use when building React components to ensure they are simple, testable, and follow best practices
---

# React Component Development

## Overview

Build React components as **pure functions** that accept props and return JSX. Keep business logic out of components.

**Core principle:** A component should be easy to understand, test, and reuse.

---

## When to Use

**Always:**
- Creating new React components
- Refactoring existing components
- Building feature-specific UI

**Exceptions (ask your human partner):**
- Wrapper components (re-exporting)
- Third-party integrations (library components)

---

## Component Design Pattern

### Step 1: Define Props Interface

```typescript
export interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onUpdate: (id: string, data: Partial<Task>) => void
}
```

**Always:**
- Name interface `[ComponentName]Props`
- Define all props with types
- Use optional (`?`) only when needed
- Include JSDoc for complex props

### Step 2: Write Component

```typescript
export const TaskCard = ({
  task,
  onDelete,
  onUpdate,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="border rounded p-4">
      {isEditing ? (
        <EditForm
          task={task}
          onSave={(data) => {
            onUpdate(task.id, data)
            setIsEditing(false)
          }}
        />
      ) : (
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </div>
  )
}
```

**Rules:**
- ✅ Component is pure (same props = same output)
- ✅ Props are spread at top
- ✅ Only UI state in component (isEditing)
- ✅ Business logic delegated to parent (onDelete, onUpdate)
- ✅ No API calls
- ✅ No globals accessed

### Step 3: Export Named Component

```typescript
export const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  // ...
}

// ✅ Can import as: import { TaskCard } from './TaskCard'
// ❌ Don't: export default TaskCard
```

**Why:** Named exports are tree-shakeable and easier to track.

---

## Props Pattern

### Props Are the API of Your Component

❌ Bad:
```typescript
export const UserProfile = ({ userId }: { userId: string }) => {
  const user = useUser(userId)  // Hidden dependency
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

**Why:** Props show exactly what component needs. Easier to test. Parent controls flow.

### Required vs Optional

```typescript
export interface ButtonProps {
  // Required - always needed
  onClick: () => void
  children: React.ReactNode

  // Optional - has sensible default
  variant?: 'primary' | 'secondary'  // defaults to 'primary'
  disabled?: boolean  // defaults to false
  size?: 'sm' | 'md' | 'lg'  // defaults to 'md'
}
```

**Rule:** If prop doesn't always make sense, make it optional with good default.

### Callback Props

```typescript
export interface ModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
}

export const Modal = ({ open, onClose, onConfirm, title }: ModalProps) => {
  if (!open) return null

  return (
    <dialog>
      <h2>{title}</h2>
      <button onClick={onClose}>Cancel</button>
      {onConfirm && <button onClick={onConfirm}>Confirm</button>}
    </dialog>
  )
}
```

**Pattern:** Callbacks are `on[Action]` and usually `void` return.

---

## Component Types

### Presentational Component (Pure UI)

```typescript
// Only renders props, no state or effects
export const Badge = ({ text, variant = 'default' }: BadgeProps) => (
  <span className={`badge badge-${variant}`}>{text}</span>
)
```

**Use for:** UI elements, styling, presentation-only.

### Container Component (with Hooks)

```typescript
// Owns state and effects, passes data to presentational components
export const TaskListContainer = ({ userId }: { userId: string }) => {
  const { data: tasks, isLoading } = useTasks(userId)

  if (isLoading) return <Loading />

  return <TaskList tasks={tasks} onDelete={deleteTask} />
}
```

**Use for:** Feature logic, data fetching, state management.

### Compound Component (Flexible Groups)

```typescript
// Parent and child components work together
export const Tabs = {
  Root: ({ children }: { children: React.ReactNode }) => (
    <div className="tabs">{children}</div>
  ),
  Tab: ({ label, isActive, onClick }: TabProps) => (
    <button className={isActive ? 'active' : ''} onClick={onClick}>
      {label}
    </button>
  ),
  Panel: ({ isActive, children }: PanelProps) => (
    isActive && <div className="panel">{children}</div>
  ),
}

// Usage:
const [activeTab, setActiveTab] = useState(0)
<Tabs.Root>
  <Tabs.Tab label="Tab 1" isActive={activeTab === 0} onClick={() => setActiveTab(0)} />
  <Tabs.Tab label="Tab 2" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
  <Tabs.Panel isActive={activeTab === 0}>Content 1</Tabs.Panel>
  <Tabs.Panel isActive={activeTab === 1}>Content 2</Tabs.Panel>
</Tabs.Root>
```

**Use for:** Complex UI with flexible parts.

---

## State Management in Components

### Rule: Only UI State in Component

❌ Bad:
```typescript
export const TaskList = () => {
  const [tasks, setTasks] = useState([])  // Server data in state
  const [filter, setFilter] = useState('')  // UI state
  const [isLoading, setIsLoading] = useState(false)  // Server state

  useEffect(() => {
    setIsLoading(true)
    getTasks().then(data => {
      setTasks(data)
      setIsLoading(false)
    })
  }, [])

  return <div>{tasks.map(t => <TaskCard key={t.id} task={t} />)}</div>
}
```

✅ Good:
```typescript
export const TaskListContainer = () => {
  const { data: tasks, isLoading } = useTasks()
  const [filter, setFilter] = useState('')  // UI state only

  const filtered = tasks?.filter(t =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  ) || []

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {isLoading ? <Loading /> : <TaskList tasks={filtered} />}
    </div>
  )
}
```

**Rule:** Use React Query for server data. Use useState only for UI (filters, open/closed, form inputs).

### Form State Pattern

```typescript
export const LoginForm = ({ onSubmit }: { onSubmit: (data: LoginData) => Promise<void> }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

**Pattern:**
- Form fields in state
- Error state for user feedback
- isSubmitting state for loading indicator
- Callback to parent for submission

---

## Conditional Rendering

### Pattern 1: Ternary (Simple)

```typescript
{isLoading ? <Loading /> : <Content />}
```

### Pattern 2: &&Operator (Show/Hide)

```typescript
{error && <ErrorAlert message={error} />}
```

### Pattern 3: Early Return (Complex)

```typescript
export const Component = ({ data }: Props) => {
  if (!data) return <Empty />
  if (error) return <Error />
  if (isLoading) return <Loading />

  return <Content data={data} />
}
```

**Rule:** Early returns at top make component easier to read.

---

## Effects Pattern (useEffect)

❌ Bad:
```typescript
// Multiple unrelated effects
useEffect(() => { /* fetch data */ }, [])
useEffect(() => { /* handle filter change */ }, [filter])
useEffect(() => { /* debounce search */ }, [search])
```

✅ Good:
```typescript
// One effect per responsibility
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(search)
  }, 300)

  return () => clearTimeout(timer)
}, [search])
```

**Rules:**
- One effect per side effect
- Include cleanup if needed
- List all dependencies
- Don't fetch in useEffect without guard against race conditions

---

## Error Handling

### Always Show Error to User

```typescript
export const UserList = () => {
  const { data: users, error, isLoading } = useUsers()

  if (error) {
    return (
      <div className="error-box">
        <h3>Failed to load users</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  if (isLoading) return <Loading />

  return <div>{users?.map(u => <UserCard key={u.id} user={u} />)}</div>
}
```

**Rule:** Display error to user, don't silently fail.

---

## File Organization

### Per-Feature File Structure

```
features/tasks/
├── components/
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   ├── TaskForm.tsx
│   └── index.ts
├── hooks/
│   ├── useTasks.ts
│   ├── useTask.ts
│   └── index.ts
├── api.ts
├── types.ts
└── index.ts
```

### Index Files for Clean Imports

```typescript
// features/tasks/components/index.ts
export { TaskCard } from './TaskCard'
export { TaskList } from './TaskList'
export { TaskForm } from './TaskForm'

// Usage:
import { TaskCard, TaskList } from '@/features/tasks/components'
```

---

## Accessibility

### Always Include Semantic HTML

```typescript
// ✅ Good
<button onClick={handleDelete}>Delete</button>
<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</form>

// ❌ Bad
<div onClick={handleDelete}>Delete</div>  // Not keyboard accessible
<input type="text" placeholder="Email" />  // No label
```

### Aria Labels When Needed

```typescript
<button aria-label="Close dialog" onClick={onClose}>×</button>
<div role="alert" className="error">{errorMessage}</div>
```

---

## Testing Components

### Test by Props, Not Implementation

```typescript
test('renders task title', () => {
  const task = { id: '1', title: 'Buy milk', completed: false }
  render(<TaskCard task={task} onDelete={jest.fn()} />)

  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})

test('calls onDelete when delete button clicked', () => {
  const onDelete = jest.fn()
  const task = { id: '1', title: 'Buy milk', completed: false }

  render(<TaskCard task={task} onDelete={onDelete} />)
  fireEvent.click(screen.getByText('Delete'))

  expect(onDelete).toHaveBeenCalledWith('1')
})
```

---

## Red Flags

- ❌ Component imports from another feature
- ❌ API call directly in component
- ❌ Props not typed
- ❌ useState for server data
- ❌ No error handling
- ❌ Component does multiple unrelated things
- ❌ No accessibility (semantic HTML, labels)
- ❌ Passing entire object when only need one field
- ❌ Long component files (>200 lines)
- ❌ Deep prop drilling (>3 levels)

**If you see these, refactor before moving forward.**

---

## Quick Checklist

Before considering component done:

- [ ] Props interface defined
- [ ] Component is pure (same props = same output)
- [ ] No API calls in component
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Component tests pass
- [ ] TypeScript compiles without warnings
- [ ] No console errors/warnings
- [ ] Accessible (semantic HTML, labels)
- [ ] Reusable (could be used in another feature?)

