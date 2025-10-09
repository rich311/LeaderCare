# Leader Care - Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys from Project Settings > API
3. Create `.env.local` from the example:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Initialize Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL Editor and click **Run**

This will create:
- All database tables (profiles, providers, care_plans, etc.)
- Row Level Security (RLS) policies
- Database triggers and functions
- Indexes for performance

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## What's Included

### Pages Created
- **Homepage** (`/`) - Landing page with features overview
- **Provider Directory** (`/providers`) - Searchable directory with filters
- **Holistic Care Assessment** (`/assessment`) - Multi-step assessment form
- **Care Plan** (`/care-plan`) - Personalized care plan display
- **Authentication** (`/auth/login`, `/auth/signup`) - Sign up and login pages

### Key Features
- ✅ Responsive mobile-first design
- ✅ Supabase authentication with session management
- ✅ Protected routes with automatic redirects
- ✅ Provider search and filtering (specialty, location, telehealth, etc.)
- ✅ Multi-step assessment form
- ✅ AI-powered care plan generation
- ✅ Database with Row Level Security
- ✅ TypeScript type safety

### Database Tables
- `profiles` - User profiles (auto-created on signup)
- `providers` - Holistic health provider directory
- `care_plans` - User care plans with recommendations
- `care_plan_resources` - Resources linked to care plans
- `provider_reviews` - Provider ratings and reviews
- `saved_providers` - User-saved favorites

## Adding Test Data

### Add Sample Providers

Run this SQL in Supabase SQL Editor to add test providers:

```sql
INSERT INTO providers (name, credentials, specialties, bio, email, city, state, telehealth_available, faith_based, accepting_new_clients) VALUES
('Dr. Sarah Johnson', 'PhD, LPC', ARRAY['Burnout', 'Anxiety', 'Depression'], 'Specializing in clergy burnout and compassion fatigue with 15+ years experience.', 'sarah.johnson@example.com', 'Nashville', 'TN', true, true, true),
('Rev. Michael Chen', 'MDiv, LMFT', ARRAY['Relationship Issues', 'Spiritual Crisis', 'Work-Life Balance'], 'Faith-integrated counseling for ministry leaders and their families.', 'michael.chen@example.com', 'Austin', 'TX', true, true, true),
('Dr. Emily Rodriguez', 'PsyD', ARRAY['Anxiety', 'Moral Injury', 'Grief/Loss'], 'Trauma-informed care with understanding of unique ministry pressures.', 'emily.rodriguez@example.com', 'Chicago', 'IL', false, false, true);
```

## Next Steps

1. **Test the Application**
   - Create an account at `/auth/signup`
   - Complete the assessment at `/assessment`
   - View your generated care plan at `/care-plan`
   - Browse providers at `/providers`

2. **Customize the Platform**
   - Update branding in `src/app/layout.tsx`
   - Modify assessment questions in `src/components/AssessmentForm.tsx`
   - Enhance care plan generation logic
   - Add more provider specialties

3. **Optional Enhancements**
   - Add AI integration (OpenAI) for enhanced care plans
   - Implement provider booking system
   - Add messaging between users and providers
   - Create admin dashboard for managing providers

## Troubleshooting

### Authentication Issues
- Verify Supabase URL and keys in `.env.local`
- Check that the `handle_new_user()` trigger is created
- Ensure email confirmation is configured in Supabase Auth settings

### Database Errors
- Verify all tables were created successfully
- Check RLS policies are enabled
- Ensure triggers are active

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check the `CLAUDE.md` file for development guidance
2. Review Supabase logs in the dashboard
3. Open an issue in the repository
