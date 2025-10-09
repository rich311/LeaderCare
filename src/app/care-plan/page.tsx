import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import CarePlanView from '@/components/CarePlanView'

export default async function CarePlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/care-plan')
  }

  const { data: carePlans } = await supabase
    .from('care_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const activePlan = carePlans?.find(plan => plan.status === 'active')

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activePlan ? (
            <CarePlanView carePlan={activePlan} />
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
