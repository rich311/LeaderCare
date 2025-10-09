import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import ProviderSearch from '@/components/ProviderSearch'

export default async function ProvidersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .order('rating', { ascending: false })

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Holistic Health Provider Directory</h1>
            <p className="mt-2 text-gray-600">
              Find compassionate holistic health professionals who understand the unique challenges of ministry leadership
            </p>
          </div>

          <ProviderSearch initialProviders={providers || []} userId={user?.id} />
        </div>
      </div>
    </>
  )
}
