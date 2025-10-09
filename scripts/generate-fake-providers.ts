// Script to generate 500 fake providers for testing
// Run with: npx tsx scripts/generate-fake-providers.ts

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth',
  'Nancy', 'Lisa', 'Betty', 'Dorothy', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Charles', 'George', 'Brian', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
]

const credentials = [
  'PhD', 'PsyD', 'LCSW', 'LMFT', 'LPC', 'MA', 'MS', 'LCPC', 'LPCC', 'NCC',
  'LMHC', 'LSW', 'LISW', 'CSAT', 'CADC', 'CAC', 'MDiv', 'DMin', 'ThD', 'ThM'
]

const specialties = [
  'Anxiety', 'Depression', 'Trauma & PTSD', 'Marriage & Family', 'Grief & Loss',
  'Addiction & Recovery', 'Stress Management', 'Life Transitions', 'Burnout',
  'Career Counseling', 'Spiritual Direction', 'Christian Counseling', 'Couples Therapy',
  'Individual Therapy', 'Group Therapy', 'Child & Adolescent', 'Geriatric Care',
  'Eating Disorders', 'Anger Management', 'Self-Esteem', 'Relationship Issues',
  'Parenting Support', 'Work-Life Balance', 'Identity & Purpose', 'Crisis Intervention'
]

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco',
  'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Detroit',
  'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque',
  'Tucson', 'Fresno', 'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Colorado Springs',
  'Raleigh', 'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tulsa',
  'Arlington', 'Tampa', 'New Orleans', 'Wichita', 'Cleveland', 'Bakersfield', 'Aurora', 'Anaheim'
]

const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'TX', 'FL', 'TX', 'OH', 'CA',
  'NC', 'IN', 'WA', 'CO', 'MA', 'TN', 'MI', 'OR', 'NV', 'TN', 'KY', 'MD', 'WI', 'NM',
  'AZ', 'CA', 'CA', 'MO', 'AZ', 'GA', 'CO', 'NC', 'FL', 'VA', 'NE', 'CA', 'MN', 'OK',
  'TX', 'FL', 'LA', 'KS', 'OH', 'CA', 'CO', 'CA'
]

const insurances = [
  'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Humana',
  'Medicare', 'Medicaid', 'Kaiser Permanente', 'Anthem', 'TriCare'
]

const durations = ['Day', 'Weekend', 'Week', 'Year-long']

const contentResources = ['Books', 'Online Courses', 'Podcast']

const denominations = [
  'Catholic', 'Pentecostal', 'Baptist', 'Methodist', 'Lutheran', 'Presbyterian',
  'Anglican/Episcopal', 'Non-denominational', 'Assembly of God', 'Church of Christ',
  'Evangelical', 'Reformed'
]

const relationalSupport = [
  'Spiritual Directors', 'Exec/Leadership Coaches', 'Financial Guides',
  'Nutrition/Health Coaches', 'Mentors'
]

const bioTemplates = [
  'Passionate about helping individuals and families find healing and wholeness through faith-integrated counseling.',
  'Dedicated to supporting church leaders and ministry professionals navigate the unique challenges of vocational ministry.',
  'Committed to providing compassionate, evidence-based care that honors both psychological science and spiritual growth.',
  'Experienced in working with trauma survivors and those seeking restoration through therapeutic and spiritual practices.',
  'Focused on holistic wellness, integrating mental health, physical well-being, and spiritual formation.',
  'Specializing in helping clients overcome life\'s challenges while deepening their relationship with God.',
  'Offering a safe space for exploration, healing, and personal transformation rooted in Christian values.',
  'Believer in the power of community, connection, and Christ-centered care for lasting change.',
  'Walking alongside clients as they discover purpose, resilience, and hope in their journey.',
  'Providing culturally sensitive care that respects diverse backgrounds while honoring faith traditions.'
]

function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomSubset<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomBoolean(probability: number = 0.5): boolean {
  return Math.random() < probability
}

async function generateProviders() {
  console.log('Generating 500 fake providers...')

  const providers = []

  for (let i = 0; i < 500; i++) {
    const firstName = random(firstNames)
    const lastName = random(lastNames)
    const cityIndex = Math.floor(Math.random() * cities.length)
    const city = cities[cityIndex]
    const state = states[cityIndex]

    const provider = {
      name: `${firstName} ${lastName}`,
      credentials: randomSubset(credentials, 1, 3).join(', '),
      specialties: randomSubset(specialties, 2, 5),
      bio: random(bioTemplates),
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      website: randomBoolean(0.6) ? `https://www.${firstName.toLowerCase()}${lastName.toLowerCase()}counseling.com` : null,
      address: randomBoolean(0.7) ? `${Math.floor(Math.random() * 9000) + 1000} ${random(['Main', 'Oak', 'Maple', 'Park', 'Cedar', 'Elm'])} Street` : null,
      city,
      state,
      zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
      insurance_accepted: randomSubset(insurances, 2, 6),
      accepting_new_clients: randomBoolean(0.7),
      languages: randomBoolean(0.3)
        ? ['English', random(['Spanish', 'French', 'German', 'Chinese', 'Korean', 'Vietnamese'])]
        : ['English'],
      rating: Number((Math.random() * 2 + 3).toFixed(2)), // 3.0 to 5.0
      review_count: Math.floor(Math.random() * 100),
      location_type: random(['in-person', 'virtual', 'both']),
      location_details: randomBoolean(0.5) ? `Office located in downtown ${city}. Easy parking available.` : null,
      gloo_scholarship_available: randomBoolean(0.3),
      service_durations: randomSubset(durations, 1, 3),
      content_resources: randomBoolean(0.4),
      content_resources_list: randomBoolean(0.4) ? randomSubset(contentResources, 1, 3) : [],
      denominations: randomSubset(denominations, 1, 4),
      retreat_facilitated: randomBoolean(0.25),
      actual_therapists: randomBoolean(0.6),
      general_relational_support: randomBoolean(0.5) ? randomSubset(relationalSupport, 1, 3) : [],
      benevolence_request: randomBoolean(0.35),
    }

    providers.push(provider)

    if ((i + 1) % 50 === 0) {
      console.log(`Generated ${i + 1} providers...`)
    }
  }

  console.log('Inserting providers into database...')

  // Insert in batches of 100 to avoid timeout
  const batchSize = 100
  for (let i = 0; i < providers.length; i += batchSize) {
    const batch = providers.slice(i, i + batchSize)
    const { error } = await supabase
      .from('providers')
      .insert(batch)

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      throw error
    }

    console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(providers.length / batchSize)}`)
  }

  console.log('✅ Successfully generated and inserted 500 fake providers!')
}

generateProviders().catch(console.error)
