import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import ProviderApplicationForm from '@/components/ProviderApplicationForm'

export default async function ProviderApplyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Provider Application
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for your interest in joining Leader Care. Please complete the application below to be considered for our provider directory.
              </p>
            </div>
            <ProviderApplicationForm />
          </div>
        </div>
      </div>
    </>
  )
}
