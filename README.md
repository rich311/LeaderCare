# Leader Care

A holistic care support platform designed specifically for church leaders and ministry professionals. Leader Care helps users find compassionate holistic care providers and generates personalized care plans tailored to the unique challenges of ministry leadership.

## Features

- **Provider Directory**: Search and filter holistic care professionals by specialty, location, insurance, and more
- **Holistic Care Assessment**: Comprehensive assessment tool to evaluate current holistic care needs
- **AI-Powered Care Plans**: Automatically generated personalized care plans based on assessment results
- **Faith-Integrated Options**: Connect with providers who can integrate faith perspectives into treatment
- **Secure & Confidential**: Built with privacy and security as top priorities using Supabase

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Icons**: Lucide React
- **Form Validation**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd leader-care
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL script from `supabase/schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
leader-care/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── auth/         # Authentication pages and routes
│   │   ├── providers/    # Provider directory
│   │   ├── assessment/   # Holistic health assessment
│   │   └── care-plan/    # Care plan display
│   ├── components/       # React components
│   ├── lib/              # Utility functions and configurations
│   │   └── supabase/     # Supabase client setup
│   └── types/            # TypeScript type definitions
├── supabase/
│   └── schema.sql        # Database schema and policies
└── public/               # Static assets
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:

- **profiles**: Extended user profiles (linked to Supabase auth.users)
- **providers**: Holistic health provider directory
- **care_plans**: User care plans with assessment data and recommendations
- **care_plan_resources**: Resources linked to care plans
- **provider_reviews**: User reviews and ratings for providers
- **saved_providers**: User-saved favorite providers

## Security

- Row Level Security (RLS) policies ensure users can only access their own data
- Authentication handled by Supabase Auth
- Sensitive data encrypted at rest
- HTTPS enforced in production

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
