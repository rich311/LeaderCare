# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leader Care is a Next.js 15 application that provides holistic health support specifically for church leaders and ministry professionals. The platform features a provider directory, holistic health assessment tool, and AI-powered care plan generation.

## Development Commands

**Development:**
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

**Testing Individual Features:**
- Provider directory: Navigate to `/providers`
- Assessment: Navigate to `/assessment` (requires auth)
- Care plans: Navigate to `/care-plan` (requires auth)
- Auth flows: Navigate to `/auth/login` or `/auth/signup`

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router (all pages are Server Components by default)
- **Client Components**: Marked with `'use client'` directive - used for interactivity (forms, search, filtering)
- **Styling**: Tailwind CSS with mobile-first responsive design

### Backend Architecture
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Supabase real-time subscriptions (not yet implemented but available)

### Data Flow
1. Server Components fetch data directly from Supabase (using `@/lib/supabase/server`)
2. Client Components use Supabase client (using `@/lib/supabase/client`) for mutations
3. Middleware (`src/middleware.ts`) handles session refresh on every request
4. RLS policies enforce data access control at database level

### Key Supabase Patterns

**Server Components (default):**
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data } = await supabase.from('table').select()
```

**Client Components:**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('table').select()
```

**Authentication Check:**
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')
```

## Database Schema

**Core Tables:**
- `profiles` - Extended user data (auto-created via trigger from auth.users)
- `providers` - Holistic health provider directory
- `care_plans` - User care plans with assessment_data (jsonb) and recommendations (jsonb)
- `care_plan_resources` - Resources/providers linked to care plans
- `provider_reviews` - Reviews and ratings (auto-updates provider.rating)
- `saved_providers` - User favorites

**Important Schema Details:**
- All tables have RLS enabled - policies in `supabase/schema.sql`
- `updated_at` timestamps auto-update via triggers
- Provider ratings auto-calculate via trigger on review changes
- Profile creation automated via `handle_new_user()` trigger on auth signup

**Running Schema Updates:**
1. Modify `supabase/schema.sql`
2. Run SQL in Supabase dashboard SQL Editor
3. Or use Supabase CLI: `supabase db push`

## Component Patterns

**Page Structure:**
```typescript
// Server Component (default)
export default async function Page() {
  const supabase = await createClient()
  const data = await fetchData() // Server-side data fetching

  return (
    <>
      <Navigation user={user} />
      <ClientComponent initialData={data} />
    </>
  )
}
```

**Client Component with State:**
```typescript
'use client'
export default function Component({ initialData }) {
  const [state, setState] = useState(initialData)
  // Interactive logic here
}
```

## Authentication Flow

1. User signs up at `/auth/signup` → POST to `/auth/signup/route.ts`
2. Supabase creates auth.users record → trigger creates profiles record
3. User signs in at `/auth/login` → POST to `/auth/signin/route.ts`
4. Session stored in cookies, refreshed by middleware
5. Sign out: POST to `/auth/signout/route.ts`

## Care Plan Generation

Assessment flow (`src/components/AssessmentForm.tsx`):
1. Multi-step form collects user data (stress level, concerns, preferences)
2. `generateRecommendations()` creates structured recommendations based on responses
3. `determinePriorityLevel()` sets priority (low/medium/high/urgent)
4. Saves to `care_plans` table with jsonb fields
5. Redirects to `/care-plan` to display results

**Extending Care Plan Logic:**
- Add new concern types to `concerns` array
- Update `generateRecommendations()` to handle new patterns
- Modify recommendation structure in jsonb as needed

## Provider Directory

Search/filter logic in `src/components/ProviderSearch.tsx`:
- Client-side filtering for performance (useMemo)
- Filters: search term, specialties (multi-select), telehealth, faith-based, accepting clients
- All specialties extracted dynamically from provider data
- Results update instantly as filters change

**Adding New Provider Fields:**
1. Update `providers` table schema
2. Update TypeScript types in `src/types/database.types.ts`
3. Update ProviderSearch component to filter/display new fields

## TypeScript Types

Database types in `src/types/database.types.ts` define the schema structure:
- `Database['public']['Tables']['table_name']['Row']` - Full row type
- `Database['public']['Tables']['table_name']['Insert']` - Insert type
- `Database['public']['Tables']['table_name']['Update']` - Update type

**Regenerating Types:**
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

## Mobile Responsiveness

All components use Tailwind's mobile-first approach:
- Base styles = mobile (default)
- `sm:` = 640px+ (tablets)
- `md:` = 768px+ (small laptops)
- `lg:` = 1024px+ (desktops)

Navigation has dedicated mobile menu with hamburger toggle.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Public anon key
SUPABASE_SERVICE_ROLE_KEY=       # Service role (server-side only)
```

Optional:
```
OPENAI_API_KEY=                   # For AI-enhanced care plan generation (future)
```

## Common Development Tasks

**Adding a New Page:**
1. Create file in `src/app/[route]/page.tsx`
2. Add to navigation in `src/components/Navigation.tsx`
3. Add auth check if protected route
4. Fetch any required data in Server Component

**Adding a New Database Table:**
1. Add SQL to `supabase/schema.sql`
2. Create RLS policies for the table
3. Run SQL in Supabase dashboard
4. Regenerate TypeScript types
5. Update app code to use new table

**Adding a New Form:**
1. Create client component with `'use client'`
2. Use react-hook-form for form state
3. Use zod for validation (already installed)
4. Submit to Supabase from client or via API route

**Debugging Supabase Issues:**
- Check RLS policies in Supabase dashboard
- Use `.explain()` to debug queries: `supabase.from('table').select().explain()`
- Check Supabase logs in dashboard for errors
- Verify user session: `const { data: { user } } = await supabase.auth.getUser()`
