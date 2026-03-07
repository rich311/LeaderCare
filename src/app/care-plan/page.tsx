import { createClient as createServiceClient } from '@supabase/supabase-js'
import Navigation from '@/components/Navigation'
import CarePlanView from '@/components/CarePlanView'

const DEMO_CARE_PLAN_ID = '419487b1-f7d9-4f1f-b78d-d00f8511410a'

export default async function CarePlanPage() {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: carePlan } = await supabase
    .from('care_plans')
    .select('*')
    .eq('id', DEMO_CARE_PLAN_ID)
    .single()

  return (
    <>
      <Navigation user={null} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {carePlan ? (
            <CarePlanView carePlan={carePlan} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Care Plan</h2>
              <p className="text-gray-600 mb-6">
                Complete the assessment to generate your personalized care plan.
              </p>
              <a
                href="/assessment"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Assessment
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
