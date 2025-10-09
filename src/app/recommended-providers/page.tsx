import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import RecommendedProvidersView from '@/components/RecommendedProvidersView'

export default async function RecommendedProvidersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/recommended-providers')
  }

  // Get the user's active care plan
  const { data: carePlans } = await supabase
    .from('care_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const activePlan = carePlans?.[0]

  if (!activePlan) {
    redirect('/assessment')
  }

  // Get all providers
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .eq('accepting_new_clients', true)
    .order('rating', { ascending: false })

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedProvidersView
            carePlan={activePlan}
            allProviders={providers || []}
          />
        </div>
      </div>
    </>
  )
}
