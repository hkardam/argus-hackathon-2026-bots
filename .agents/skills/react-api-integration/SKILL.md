---
name: react-api-integration
description: Use when building API integration between frontend and backend, defining contracts, and handling requests/responses
---

# React API Integration

## Overview

API integration is the **contract between frontend and backend**. Get this wrong and spend hours debugging "why doesn't my API call work?"

**Core principle:** Frontend and backend agree on request/response shape BEFORE implementing.

---

## When to Use

**Always:**
- Creating new API endpoints
- Integrating frontend with backend
- Defining request/response types
- Handling API errors
- Testing API contracts

---

## Phase 1: API Contract (Before Any Code)

### Step 1: Backend Defines Endpoints

```java
// backend/Controller.java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  @GetMapping
  public ResponseEntity<List<TaskResponse>> getTasks() {
    // Returns Task[]
  }

  @PostMapping
  public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest req) {
    // Accepts { title, description }
    // Returns created Task
  }

  @PutMapping("/{id}")
  public ResponseEntity<TaskResponse> updateTask(
    @PathVariable String id,
    @RequestBody UpdateTaskRequest req
  ) {
    // Returns updated Task
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable String id) {
    // Returns 204 No Content
  }
}
```

### Step 2: Document Response Format

```typescript
// shared/api-contract.ts (agreed between team)

// GET /api/tasks
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string  // ISO 8601 format
  updatedAt: string
}

export type TaskResponse = Task

// POST /api/tasks
export interface CreateTaskRequest {
  title: string
  description: string
}

// PUT /api/tasks/:id
export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
}

// Error response
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}
```

### Step 3: Test Contract Immediately

Backend team:
```java
// Test returns correct format
@Test
public void testGetTasksReturnsCorrectFormat() {
  List<TaskResponse> tasks = taskController.getTasks().getBody();
  assertThat(tasks).isNotEmpty();
  assertThat(tasks.get(0).getId()).isNotNull();
  assertThat(tasks.get(0).getCreatedAt()).isNotNull();
}
```

Frontend team:
```typescript
// Test can parse response
test('getTasks returns Task[]', async () => {
  const response = await apiClient.get('/api/tasks')
  const tasks: Task[] = response.data

  expect(tasks[0].id).toBeDefined()
  expect(tasks[0].createdAt).toBeDefined()
})
```

**Check at T+1h:** Frontend calls real API, data parses correctly.

---

## Phase 2: API Client Setup

### Create Base API Client

```typescript
// src/services/apiClient.ts
import axios, { AxiosError, AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8086/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

---

## Phase 3: Feature API Files

### Structure

```
features/tasks/
├── api.ts          # All API calls for this feature
├── types.ts        # Request/response types
└── hooks/
    └── useTasks.ts # React hooks wrapping api.ts
```

### API File Pattern

```typescript
// features/tasks/api.ts
import apiClient from '@/services/apiClient'
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiError,
} from './types'

// GET /api/tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data } = await apiClient.get<Task[]>('/tasks')
    return data
  } catch (error) {
    throw handleApiError(error)
  }
}

// GET /api/tasks/:id
export const getTask = async (id: string): Promise<Task> => {
  const { data } = await apiClient.get<Task>(`/tasks/${id}`)
  return data
}

// POST /api/tasks
export const createTask = async (req: CreateTaskRequest): Promise<Task> => {
  const { data } = await apiClient.post<Task>('/tasks', req)
  return data
}

// PUT /api/tasks/:id
export const updateTask = async (
  id: string,
  req: UpdateTaskRequest
): Promise<Task> => {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, req)
  return data
}

// DELETE /api/tasks/:id
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`)
}

// Error handling helper
function handleApiError(error: any): ApiError {
  if (error.response?.data) {
    return error.response.data
  }
  return {
    code: 'NETWORK_ERROR',
    message: error.message || 'Failed to fetch',
  }
}
```

### Types File

```typescript
// features/tasks/types.ts

// API Response types
export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

// API Request types
export interface CreateTaskRequest {
  title: string
  description: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
}

// Error type
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}
```

---

## Phase 4: React Query Hooks

### Query Hooks

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

// Usage in component:
const { data: tasks, isLoading, error } = useTasks()
```

### Mutation Hooks

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
const { mutate: create, isPending, error } = useCreateTask()

const handleCreate = (data: CreateTaskRequest) => {
  create(data, {
    onSuccess: () => {
      console.log('Task created!')
    },
    onError: (error) => {
      console.error('Failed:', error)
    },
  })
}
```

### Complex Queries

```typescript
// features/tasks/hooks/useTasksFiltered.ts
export const useTasksFiltered = (filter: string, limit: number) => {
  return useQuery({
    queryKey: ['tasks', { filter, limit }],
    queryFn: () => getTasks(), // Could add server-side filtering
    select: (data) => {
      // Client-side filtering
      return data
        .filter((task) =>
          task.title.toLowerCase().includes(filter.toLowerCase())
        )
        .slice(0, limit)
    },
  })
}
```

---

## Handling Different Response Types

### Simple Data

```typescript
// GET /api/tasks → Task[]
const { data: tasks } = useTasks()
// tasks: Task[] | undefined
```

### Paginated Data

```typescript
// GET /api/tasks?page=1 → { items: Task[], total: number }
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export const useTasksPaginated = (page: number) => {
  return useQuery({
    queryKey: ['tasks', page],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Task>>('/tasks', {
        params: { page },
      }),
  })
}
```

### File Upload

```typescript
export const uploadTaskFile = async (taskId: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<Task>(
    `/tasks/${taskId}/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
  return data
}
```

---

## Error Handling

### At API Level

```typescript
// features/tasks/api.ts
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data } = await apiClient.get<Task[]>('/tasks')
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized')
      }
      if (error.response?.status === 404) {
        throw new Error('Not found')
      }
    }
    throw new Error('Failed to fetch tasks')
  }
}
```

### At Hook Level

```typescript
const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    retry: 1,  // Retry failed requests once
    onError: (error) => {
      console.error('Error:', error)
    },
  })
}
```

### At Component Level

```typescript
export const TaskList = () => {
  const { data: tasks, error, isLoading } = useTasks()

  if (isLoading) return <Loading />

  if (error) {
    return (
      <div className="error">
        <h3>Failed to load tasks</h3>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return <div>{tasks?.map(t => <TaskCard key={t.id} task={t} />)}</div>
}
```

---

## Testing API Integration

### Mock apiClient

```typescript
// features/tasks/__tests__/api.test.ts
import { getTasks } from '../api'
import apiClient from '@/services/apiClient'

jest.mock('@/services/apiClient')

test('getTasks returns tasks', async () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false, createdAt: '2024-01-01' },
  ]

  ;(apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks })

  const result = await getTasks()

  expect(result).toEqual(mockTasks)
  expect(apiClient.get).toHaveBeenCalledWith('/tasks')
})
```

### Test with React Query

```typescript
// features/tasks/__tests__/useTasks.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from '../hooks/useTasks'

test('useTasks fetches tasks', async () => {
  const queryClient = new QueryClient()
  const { result } = renderHook(() => useTasks(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
  })

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })

  expect(result.current.data).toBeDefined()
})
```

---

## Common Patterns

### Search with Debounce

```typescript
export const useTasksSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ['tasks', searchTerm],
    queryFn: () => getTasks(), // Add filter to API
    enabled: searchTerm.length > 2,  // Don't search too early
    staleTime: 5 * 60 * 1000,  // Cache for 5 min
  })
}

// In component:
const [search, setSearch] = useState('')
const { data: results } = useTasksSearch(search)

<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search tasks..."
/>
```

### Optimistic Updates

```typescript
const { mutate: updateTask } = useMutation({
  mutationFn: (data: UpdateTaskRequest) => updateTask('1', data),
  onMutate: async (newData) => {
    // Cancel pending queries
    await queryClient.cancelQueries({ queryKey: ['tasks'] })

    // Optimistically update cache
    const previousData = queryClient.getQueryData(['tasks'])
    queryClient.setQueryData(['tasks'], (old: Task[]) =>
      old.map(t => t.id === '1' ? { ...t, ...newData } : t)
    )

    return { previousData }
  },
  onError: (_err, _variables, context) => {
    // Revert on error
    queryClient.setQueryData(['tasks'], context?.previousData)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  },
})
```

---

## Common Mistakes

| Mistake | Why Bad | Fix |
|---------|--------|-----|
| API call in component | Unmaintainable, hard to test | Put in `api.ts`, use hooks |
| No TypeScript for responses | Type errors at runtime | Define `types.ts` with interfaces |
| Not syncing API contract | Frontend/backend mismatch | Agree on types before coding |
| No error handling | Silent failures | Always handle errors in UI |
| Not using React Query | Refetching manually | Use useQuery for server state |
| Fetching same data multiple times | Wasted requests | Use caching with React Query |
| Not parsing API errors | "Something went wrong" messages | Parse error.response.data |

---

## Verification Checklist

Before considering API integration done:

- [ ] API contract agreed with backend
- [ ] Types defined for request/response
- [ ] API file has all endpoints
- [ ] Hooks wrap API calls
- [ ] Error handling in place
- [ ] Loading states handled
- [ ] Tests pass
- [ ] TypeScript compiles without warnings
- [ ] Frontend can call real API (not mock)
- [ ] Integration tested end-to-end

