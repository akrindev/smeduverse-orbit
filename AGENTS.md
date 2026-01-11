# AGENTS.md

Build/Lint/Test Commands
- bun run dev: Development server (with Turbopack)
- bun run build: Production build
- bun run start: Production server
- bun run lint: ESLint linting (next/core-web-vitals)
- No test framework currently configured

Code Style & Formatting
- Biome: Tab indentation, double quotes, auto-organize imports enabled
- ESLint: React hooks rules enforced, exhaustive-deps disabled
- IMPORTANT: Never add comments unless explicitly requested

Import Conventions
- Use path aliases: @/* maps to ./src/*
- Type-only imports: import { type X } from "module"
- Biome automatically organizes imports on save

TypeScript Guidelines
- Strict mode enabled, noImplicitAny: false
- Define interfaces in src/types/ for reusable data structures
- Export types from queries and stores for component consumption
- Use proper typing for all components, hooks, API responses

Component Development
- "use client" directive required for all client components
- Use React.forwardRef + displayName for forwarded refs
- Shadcn UI components located in src/components/ui/
- Tailwind CSS for styling with cn() utility (clsx + tailwind-merge)
- Follow CVA pattern for component variants (see button.tsx)

State Management (Zustand)
- Stores in src/store/ with persist middleware
- Use createJSONStorage with custom SSR-safe localStorage handler
- Pattern: define State interface, actions as methods, persist with partialize
- Key stores: useAuth, useUser, useAttendance, useModul, usePresence, useRombel, useSemester, useSelectedDate

Data Fetching
- TanStack Query hooks in src/queries/ with consistent query keys pattern
- Axios API client from src/lib/api.ts with interceptors
- Use useMutation for write operations, useQuery for reads
- Invalidate queries on mutations with queryClient.invalidateQueries()
- Query keys pattern: export const xQueryKeys = { y: ["namespace", "key"] }

Forms
- React Hook Form for form management
- Zod for runtime validation and TypeScript types
- Shadcn Form components for UI
- Validate on submit, show errors via toast notifications

Error Handling
- Toast notifications from src/components/ui/use-toast
- API interceptors handle 401 (redirect to login) and 422 (validation errors)
- Try-catch blocks with descriptive error messages
- Catch errors in store actions and return { success: boolean, error?: string }

Project Structure (App Router)
- src/app/(authenticated)/: Protected routes (dashboard, modul, presensi, rekap, mata-pelajaran, semester)
- src/app/api/: API routes
- src/app/login/: Authentication pages
- src/components/: Reusable components (ui/, hooks/, lib/)
- src/lib/: Utilities (api.ts, utils.ts, auth-*.ts)
- src/store/: Zustand stores
- src/queries/: TanStack Query hooks
- src/types/: TypeScript interfaces

Authentication System
- Token-based auth with Laravel Sanctum backend
- Use configured api instance from src/lib/api.ts
- Token stored in localStorage as auth_token
- Interceptors auto-add Bearer token to requests
- 401 errors clear auth data and redirect to /login
- Protected routes in (authenticated) directory group

Key Libraries
- Next.js 16 with App Router (Turbopack enabled)
- React 19
- TypeScript 5.9
- Tailwind CSS v4
- Shadcn UI (Radix UI primitives)
- TanStack Query (data fetching/caching)
- Zustand (state management)
- React Hook Form + Zod (forms/validation)
- Axios (HTTP client)
- Lucide React (icons)
- Sonner (toast notifications)

Path Resolution
- baseUrl: "." configured in tsconfig.json
- paths: "@/*": ["./src/*"]
- Import components: import { Button } from "@/components/ui/button"
- Import utilities: import { api } from "@/lib/api"
- Import stores: import { useAuth } from "@/store/useAuth"
- Import types: import type { User } from "@/types/auth"

Styling Patterns
- Use Tailwind utility classes for styling
- Merge conflicting classes with cn() from src/lib/utils.ts
- Follow shadcn/ui component patterns
- Use semantic colors: primary, secondary, destructive, accent, muted, foreground, background

API Integration
- All API calls use the configured api instance (Axios)
- BASE_URL from NEXT_PUBLIC_API_URL environment variable
- Content-Type: application/json, Accept: application/json, X-Requested-With: XMLHttpRequest
- Handle loading states with isLoading boolean in stores
- Cache responses with TanStack Query for better performance

Component Props Pattern
- Extend React component props: interface Props extends React.HTMLAttributes<HTMLElement>
- Use VariantProps from class-variance-authority for variant props
- Forward refs with React.forwardRef when needed
- Set displayName on forwarded components: Component.displayName = "Name"
