import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import AssessmentForm from '@/components/AssessmentForm'

export default async function AssessmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/assessment')
  }

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Holistic Health Assessment</h1>
            <p className="mt-2 text-gray-600">
              This assessment will help us create a personalized care plan tailored to your needs.
              Your responses are confidential and secure.
            </p>
          </div>

          <AssessmentForm userId={user.id} />
        </div>
      </div>
    </>
  )
}
