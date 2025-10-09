'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileFormProps {
  profile: Profile | null
  userId: string
}

export default function ProfileForm({ profile, userId }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    church_name: profile?.church_name || '',
    denomination: profile?.denomination || '',
    phone: profile?.phone || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          church_name: formData.church_name,
          denomination: formData.denomination,
          phone: formData.phone,
        })
        .eq('id', userId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={profile?.email || ''}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="church_name" className="block text-sm font-medium text-gray-700">
            Church/Organization
          </label>
          <input
            type="text"
            id="church_name"
            value={formData.church_name}
            onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="denomination" className="block text-sm font-medium text-gray-700">
            Denomination
          </label>
          <input
            type="text"
            id="denomination"
            value={formData.denomination}
            onChange={(e) => setFormData({ ...formData, denomination: e.target.value })}
            placeholder="e.g., Baptist, Methodist, Non-denominational"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-700">Role:</span>{' '}
            <span className="text-gray-600 capitalize">{profile?.role || 'leader'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Member since:</span>{' '}
            <span className="text-gray-600">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
