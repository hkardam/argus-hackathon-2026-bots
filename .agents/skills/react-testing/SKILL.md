---
name: react-testing
description: Use when writing tests for React components, hooks, and API integration
---

# React Testing

## Overview

Test React components by testing **behavior, not implementation**.

**Core principle:** Test what the user sees and does, not how you built it.

---

## When to Use

**Always:**
- Writing new components
- Writing new hooks
- Testing API integration
- Before fixing bugs (write test first)

**Tool:** `@testing-library/react` + `vitest` (or Jest)

---

## Component Testing Pattern

### Rule: Test by Props

❌ Bad:
```typescript
test('component works', () => {
  const { container } = render(<TaskCard task={task} onDelete={() => {}} />)
  const element = container.querySelector('.task-card')  // Testing DOM, not behavior
  expect(element).toBeTruthy()
})
```

✅ Good:
```typescript
test('displays task title', () => {
  const task = { id: '1', title: 'Buy milk', completed: false }
  render(<TaskCard task={task} onDelete={() => {}} onUpdate={() => {}} />)

  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})

test('calls onDelete when delete button clicked', () => {
  const onDelete = jest.fn()
  const task = { id: '1', title: 'Buy milk', completed: false }

  render(<TaskCard task={task} onDelete={onDelete} onUpdate={() => {}} />)
  fireEvent.click(screen.getByText('Delete'))

  expect(onDelete).toHaveBeenCalledWith('1')
})
```

**Why:** Tests props = tests API. Easier to refactor.

---

## Setup

### Install Dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Configure vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
})
```

### Setup File

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

---

## Component Tests

### Simple Component

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('calls onClick when clicked', async () => {
  const onClick = jest.fn()
  render(<Button onClick={onClick}>Click me</Button>)

  await userEvent.click(screen.getByText('Click me'))

  expect(onClick).toHaveBeenCalledOnce()
})

test('disables button when disabled prop true', () => {
  render(<Button disabled>Click me</Button>)
  expect(screen.getByText('Click me')).toBeDisabled()
})
```

### List Component

```typescript
// features/tasks/components/TaskList.test.tsx
import { render, screen } from '@testing-library/react'
import { TaskList } from './TaskList'

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Desc 1',
    completed: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Desc 2',
    completed: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

test('renders all tasks', () => {
  render(<TaskList tasks={mockTasks} onDelete={() => {}} onUpdate={() => {}} />)

  expect(screen.getByText('Task 1')).toBeInTheDocument()
  expect(screen.getByText('Task 2')).toBeInTheDocument()
})

test('renders empty state when no tasks', () => {
  render(<TaskList tasks={[]} onDelete={() => {}} onUpdate={() => {}} />)

  expect(screen.getByText('No tasks yet')).toBeInTheDocument()
})

test('calls onDelete with correct ID', async () => {
  const onDelete = jest.fn()

  render(<TaskList tasks={mockTasks} onDelete={onDelete} onUpdate={() => {}} />)

  // Find and click delete button for first task
  const deleteButtons = screen.getAllByText('Delete')
  await userEvent.click(deleteButtons[0])

  expect(onDelete).toHaveBeenCalledWith('1')
})
```

### Form Component

```typescript
// features/tasks/components/TaskForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

test('submits form with title and description', async () => {
  const onSubmit = jest.fn()

  render(<TaskForm onSubmit={onSubmit} />)

  // Fill form
  await userEvent.type(screen.getByPlaceholderText('Title'), 'Buy milk')
  await userEvent.type(screen.getByPlaceholderText('Description'), 'From store')

  // Submit
  await userEvent.click(screen.getByText('Create Task'))

  expect(onSubmit).toHaveBeenCalledWith({
    title: 'Buy milk',
    description: 'From store',
  })
})

test('clears form after successful submit', async () => {
  render(<TaskForm onSubmit={() => {}} />)

  const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement
  const descInput = screen.getByPlaceholderText('Description') as HTMLInputElement

  await userEvent.type(titleInput, 'Buy milk')
  await userEvent.type(descInput, 'From store')
  await userEvent.click(screen.getByText('Create Task'))

  expect(titleInput.value).toBe('')
  expect(descInput.value).toBe('')
})

test('shows error message when submit fails', async () => {
  const onSubmit = jest.fn().mockRejectedValueOnce(new Error('API error'))

  render(<TaskForm onSubmit={onSubmit} />)

  await userEvent.type(screen.getByPlaceholderText('Title'), 'Buy milk')
  await userEvent.click(screen.getByText('Create Task'))

  expect(screen.getByText('API error')).toBeInTheDocument()
})
```

---

## Hook Tests

### Query Hook

```typescript
// features/tasks/hooks/useTasks.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from './useTasks'
import * as api from '../api'

// Mock the API
jest.mock('../api')

test('returns tasks from API', async () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false },
    { id: '2', title: 'Task 2', completed: false },
  ]

  jest.spyOn(api, 'getTasks').mockResolvedValueOnce(mockTasks)

  const queryClient = new QueryClient()

  const { result } = renderHook(() => useTasks(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })

  // Initially loading
  expect(result.current.isLoading).toBe(true)

  // Wait for data
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(result.current.data).toEqual(mockTasks)
})

test('returns error when API fails', async () => {
  const error = new Error('API failed')
  jest.spyOn(api, 'getTasks').mockRejectedValueOnce(error)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const { result } = renderHook(() => useTasks(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })

  await waitFor(() => {
    expect(result.current.isError).toBe(true)
  })

  expect(result.current.error).toEqual(error)
})
```

### Mutation Hook

```typescript
// features/tasks/hooks/useCreateTask.test.ts
test('creates task and refetches list', async () => {
  const newTask = { id: '3', title: 'New task', completed: false }

  jest.spyOn(api, 'createTask').mockResolvedValueOnce(newTask)

  const queryClient = new QueryClient()
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

  const { result } = renderHook(() => useCreateTask(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })

  result.current.mutate({ title: 'New task', description: '' })

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(invalidateSpy).toHaveBeenCalledWith(
    expect.objectContaining({ queryKey: ['tasks'] })
  )
})
```

### Custom Hook (Non-React Query)

```typescript
// hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

test('returns initial value immediately', () => {
  const { result } = renderHook(() => useDebounce('hello', 300))
  expect(result.current).toBe('hello')
})

test('debounces value changes', async () => {
  const { result, rerender } = renderHook(
    ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
    { initialProps: { value: 'hello', delay: 300 } }
  )

  expect(result.current).toBe('hello')

  // Change value
  rerender({ value: 'world', delay: 300 })
  expect(result.current).toBe('hello')  // Not updated yet

  // Wait for debounce
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 350))
  })

  expect(result.current).toBe('world')  // Now updated
})
```

---

## Integration Tests

### Component + Hook + API

```typescript
// features/tasks/__tests__/integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskListContainer } from '../components/TaskListContainer'
import * as api from '../api'

jest.mock('../api')

test('loads tasks and displays them', async () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false, description: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ]

  jest.spyOn(api, 'getTasks').mockResolvedValueOnce(mockTasks)

  const queryClient = new QueryClient()

  render(
    <QueryClientProvider client={queryClient}>
      <TaskListContainer />
    </QueryClientProvider>
  )

  // Initially shows loading
  expect(screen.getByText('Loading...')).toBeInTheDocument()

  // Wait for tasks to load
  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
})

test('deletes task and removes it from list', async () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false, description: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  ]

  jest.spyOn(api, 'getTasks').mockResolvedValueOnce(mockTasks)
  jest.spyOn(api, 'deleteTask').mockResolvedValueOnce()

  const queryClient = new QueryClient()

  const { rerender } = render(
    <QueryClientProvider client={queryClient}>
      <TaskListContainer />
    </QueryClientProvider>
  )

  await waitFor(() => {
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  // Click delete
  await userEvent.click(screen.getByText('Delete'))

  // Task should be removed after mutation
  // (depends on implementation - might stay until refetch)
})
```

---

## Testing Async Behavior

### userEvent vs fireEvent

```typescript
// ✅ Good - more realistic
await userEvent.type(input, 'hello')  // Typed character by character

// ❌ Less realistic
fireEvent.change(input, { target: { value: 'hello' } })  // Instant change
```

### Waiting for Updates

```typescript
// Wait for something to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Wait for something to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument()
})

// Wait for element
const element = await screen.findByText('Loaded')

// Wait for specific condition
await waitFor(() => {
  expect(result.current.data).toBeDefined()
})
```

---

## Mocking

### Mock Functions

```typescript
const onClick = jest.fn()
render(<Button onClick={onClick} />)

// Verify called
expect(onClick).toHaveBeenCalled()
expect(onClick).toHaveBeenCalledWith('arg')
expect(onClick).toHaveBeenCalledTimes(1)

// Mock return value
const mockFn = jest.fn().mockReturnValue('result')
expect(mockFn()).toBe('result')

// Mock rejected promise
const mockFn = jest.fn().mockRejectedValue(new Error('error'))
```

### Mock Modules

```typescript
// Mock entire module
jest.mock('../api', () => ({
  getTasks: jest.fn(),
}))

// Mock specific export
jest.spyOn(api, 'getTasks').mockResolvedValueOnce([])

// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks()
})
```

### Mock React Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,  // Don't retry on failure
      gcTime: 0,     // Don't cache between tests
    },
  },
})
```

---

## Testing Strategies

### Test Behavior, Not Implementation

❌ Bad:
```typescript
test('component has state', () => {
  const { result } = renderHook(() => useState())
  expect(result.current[0]).toBe(false)
})
```

✅ Good:
```typescript
test('checkbox can be toggled', async () => {
  render(<Checkbox defaultChecked={false} />)
  expect(screen.getByRole('checkbox')).not.toBeChecked()

  await userEvent.click(screen.getByRole('checkbox'))
  expect(screen.getByRole('checkbox')).toBeChecked()
})
```

### Test Edge Cases

```typescript
test('handles empty list', () => {
  render(<TaskList tasks={[]} />)
  expect(screen.getByText('No tasks')).toBeInTheDocument()
})

test('handles null data', () => {
  render(<TaskList tasks={null} />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('handles API error', async () => {
  jest.spyOn(api, 'getTasks').mockRejectedValueOnce(new Error('Network error'))
  // ...
})
```

### Test Error Boundaries (Optional)

```typescript
test('shows error message on failure', () => {
  jest.spyOn(api, 'getTasks').mockRejectedValueOnce(new Error('API failed'))

  render(<TaskListContainer />)

  expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
})
```

---

## Common Assertions

```typescript
// Existence
expect(screen.getByText('Hello')).toBeInTheDocument()
expect(screen.queryByText('Missing')).not.toBeInTheDocument()

// States
expect(element).toBeDisabled()
expect(element).toBeEnabled()
expect(element).toBeVisible()
expect(element).toBeInTheDOM()

// Values
expect(input).toHaveValue('hello')
expect(element).toHaveClass('active')
expect(element).toHaveAttribute('aria-label')
expect(element).toHaveTextContent('Hello World')

// Function calls
expect(onClick).toHaveBeenCalled()
expect(onClick).toHaveBeenCalledWith('arg')
expect(onClick).toHaveBeenCalledTimes(1)

// DOM queries
expect(screen.getByRole('button')).toBeInTheDocument()
expect(screen.getByLabelText('Email')).toBeInTheDocument()
expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
```

---

## Test File Organization

```
features/tasks/
├── components/
│   ├── TaskCard.tsx
│   ├── TaskCard.test.tsx       # Unit test
│   ├── TaskList.tsx
│   └── TaskList.test.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useTasks.test.ts
├── __tests__/
│   └── integration.test.tsx    # Integration test
└── api.test.ts                 # API tests
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test TaskCard.test.tsx

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Common Test Mistakes

| Mistake | Why Bad | Fix |
|---------|--------|-----|
| Testing implementation | Refactoring breaks test | Test behavior (what user sees) |
| Not mocking API | Tests hit real endpoint | Mock all API calls |
| Not waiting for async | Flaky tests | Use waitFor, findBy, act |
| Too specific (selectors) | Breaks easily | Use getByRole, getByText |
| Too vague (container) | Hard to debug | Query user-visible elements |
| Testing mocks | Testing test setup, not code | Test real behavior |
| No edge cases | Bugs in production | Test empty, error, null states |
| Skipping slow tests | Tests don't run | Remove or speed up |

---

## Test Coverage Goals (Hackathon)

| Target | How |
|--------|-----|
| **Happy path** | Test normal flow (100%) |
| **Error states** | Test failures (80%) |
| **Edge cases** | Test empty, null, errors (50%) |

**Minimum for hackathon:** 70% coverage on critical features.

---

## Verification Checklist

Before merging code with tests:

- [ ] All tests pass (`npm test`)
- [ ] No console errors/warnings
- [ ] New tests written before code (TDD)
- [ ] Tests are isolated (no dependencies between tests)
- [ ] Async properly awaited
- [ ] No skipped tests
- [ ] Mocks cleaned up between tests
- [ ] Coverage above 70%
- [ ] Tests pass on main branch too

