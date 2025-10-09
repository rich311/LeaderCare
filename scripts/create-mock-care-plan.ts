// Script to create a mock care plan for testing
// Run with: npx tsx scripts/create-mock-care-plan.ts

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

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

const userId = 'a674294f-f759-4881-a2e9-2b74b2b4f13f'

const assessmentData = {
  stressLevel: 8,
  sleepQuality: 'Poor',
  workLifeBalance: 'Very Unbalanced',
  physicalActivity: 'Rarely',
  concerns: [
    'Burnout',
    'Anxiety',
    'Work-Life Balance',
    'Sleep Issues',
    'Compassion Fatigue'
  ],
  supportSystem: 'Limited',
  previousCounseling: true,
  willingToSeek: true,
  insuranceType: 'Blue Cross Blue Shield',
  preferredFormat: 'Both in-person and virtual',
  faithIntegration: true,
  denomination: 'Non-denominational',
  timeCommitment: 'Weekend retreat or intensive',
  specificGoals: 'Address burnout from ministry demands, improve sleep, establish better boundaries, reconnect with personal spiritual practices'
}

const recommendations = {
  immediate: [
    {
      title: 'Schedule Rest and Recovery',
      description: 'Take immediate time off (at least 3-5 days) to rest and disconnect from ministry responsibilities. This is crucial given your high stress level.',
      priority: 'urgent',
      estimatedCost: 0
    },
    {
      title: 'Sleep Hygiene Assessment',
      description: 'Consult with a healthcare provider about your poor sleep quality. Consider a sleep study if insomnia persists.',
      priority: 'urgent',
      estimatedCost: 250
    },
    {
      title: 'Crisis Support Check-in',
      description: 'Given your stress level (8/10), connect with a licensed therapist who specializes in clergy burnout within the next week.',
      priority: 'urgent',
      estimatedCost: 150
    }
  ],
  shortTerm: [
    {
      title: 'Begin Weekly Therapy',
      description: 'Start weekly sessions with a therapist who specializes in ministry burnout and compassion fatigue. Faith-integrated therapy is recommended given your preferences.',
      priority: 'high',
      estimatedCost: 600
    },
    {
      title: 'Attend a Ministry Leader Retreat',
      description: 'Participate in a weekend retreat specifically designed for church leaders focusing on restoration, boundaries, and sustainable ministry.',
      priority: 'high',
      estimatedCost: 800
    },
    {
      title: 'Establish Daily Boundaries',
      description: 'Create clear boundaries around work hours, including designated "off" times when you do not respond to ministry needs except for true emergencies.',
      priority: 'high',
      estimatedCost: 0
    },
    {
      title: 'Physical Health Baseline',
      description: 'Schedule a complete physical exam to rule out any underlying health issues contributing to fatigue and poor sleep.',
      priority: 'medium',
      estimatedCost: 200
    }
  ],
  longTerm: [
    {
      title: 'Develop Sabbath Rhythms',
      description: 'Implement regular sabbath practices - weekly rest days and quarterly extended rest periods (3-4 days) away from ministry.',
      priority: 'medium',
      estimatedCost: 0
    },
    {
      title: 'Build Peer Support Network',
      description: 'Join or form a peer support group with other ministry leaders who can provide mutual encouragement and accountability.',
      priority: 'medium',
      estimatedCost: 0
    },
    {
      title: 'Spiritual Direction',
      description: 'Engage in regular spiritual direction (monthly) separate from ministry responsibilities to nurture your personal relationship with God.',
      priority: 'medium',
      estimatedCost: 400
    },
    {
      title: 'Leadership Coaching',
      description: 'Work with an executive coach who specializes in ministry leadership to develop sustainable leadership practices and delegation skills.',
      priority: 'low',
      estimatedCost: 1200
    }
  ],
  resources: [
    {
      title: 'Recommended Providers',
      description: 'Connect with licensed therapists who specialize in clergy care and understand the unique pressures of ministry leadership. Look for providers offering faith-integrated care.',
      priority: 'high',
      estimatedCost: 0
    },
    {
      title: 'Retreat Centers',
      description: 'Explore retreat centers that offer programs specifically for church leaders and ministry professionals.',
      priority: 'medium',
      estimatedCost: 0
    },
    {
      title: 'Reading Resources',
      description: 'Books: "The Emotionally Healthy Leader" by Peter Scazzero, "Strengthening the Soul of Your Leadership" by Ruth Haley Barton, "Boundaries for Leaders" by Henry Cloud',
      priority: 'low',
      estimatedCost: 60
    },
    {
      title: 'Online Courses',
      description: 'Consider online courses on self-care for ministry leaders, emotional intelligence, and sustainable leadership practices.',
      priority: 'low',
      estimatedCost: 150
    }
  ]
}

async function createMockCarePlan() {
  console.log('Creating mock care plan for user:', userId)

  // First, check if user exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('Error: User not found with ID:', userId)
    console.error('Please create a user account first or use a valid user ID')
    return
  }

  console.log('Found user:', profile.email, profile.full_name || '(no name)')

  // Delete any existing care plans for this user
  const { error: deleteError } = await supabase
    .from('care_plans')
    .delete()
    .eq('user_id', userId)

  if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error deleting existing care plans:', deleteError)
  } else {
    console.log('Cleared any existing care plans for this user')
  }

  // Create the care plan
  const { data: carePlan, error: carePlanError } = await supabase
    .from('care_plans')
    .insert({
      user_id: userId,
      assessment_data: assessmentData,
      recommendations: recommendations,
      priority_level: 'urgent',
      status: 'active'
    })
    .select()
    .single()

  if (carePlanError) {
    console.error('Error creating care plan:', carePlanError)
    throw carePlanError
  }

  console.log('✅ Successfully created care plan!')
  console.log('Care Plan ID:', carePlan.id)
  console.log('Priority Level:', carePlan.priority_level)
  console.log('Status:', carePlan.status)
  console.log('\nRecommendations Summary:')
  console.log(`- ${recommendations.immediate.length} Immediate actions`)
  console.log(`- ${recommendations.shortTerm.length} Short-term goals`)
  console.log(`- ${recommendations.longTerm.length} Long-term goals`)
  console.log(`- ${recommendations.resources.length} Resources`)
  console.log('\nYou can now view this care plan at: /care-plan')
}

createMockCarePlan().catch(console.error)
