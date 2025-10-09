import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navigation from '@/components/Navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/profile')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and personal information
            </p>
          </div>

          <ProfileForm profile={profile} userId={user.id} />
        </div>
      </div>
    </>
  )
}
