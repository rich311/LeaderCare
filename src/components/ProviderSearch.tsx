'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, Star, Heart, Phone, Mail, Globe } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Provider = Database['public']['Tables']['providers']['Row']

interface ProviderSearchProps {
  initialProviders: Provider[]
  userId?: string
}

export default function ProviderSearch({ initialProviders, userId }: ProviderSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [telehealth, setTelehealth] = useState(false)
  const [faithBased, setFaithBased] = useState(false)
  const [acceptingClients, setAcceptingClients] = useState(false)

  // Get all unique specialties
  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>()
    initialProviders.forEach(provider => {
      provider.specialties.forEach(specialty => specialtiesSet.add(specialty))
    })
    return Array.from(specialtiesSet).sort()
  }, [initialProviders])

  // Filter providers
  const filteredProviders = useMemo(() => {
    return initialProviders.filter(provider => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.city?.toLowerCase().includes(searchTerm.toLowerCase())

      // Specialty filter
      const matchesSpecialty = selectedSpecialties.length === 0 ||
        selectedSpecialties.some(specialty => provider.specialties.includes(specialty))

      // Other filters
      const matchesTelehealth = !telehealth || provider.telehealth_available
      const matchesFaith = !faithBased || provider.faith_based
      const matchesAccepting = !acceptingClients || provider.accepting_new_clients

      return matchesSearch && matchesSpecialty && matchesTelehealth && matchesFaith && matchesAccepting
    })
  }, [initialProviders, searchTerm, selectedSpecialties, telehealth, faithBased, acceptingClients])

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, specialty, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allSpecialties.map(specialty => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={() => toggleSpecialty(specialty)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={telehealth}
                onChange={(e) => setTelehealth(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Telehealth Available</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={faithBased}
                onChange={(e) => setFaithBased(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Faith-Based</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acceptingClients}
                onChange={(e) => setAcceptingClients(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Accepting New Clients</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <div className="mb-4 text-sm text-gray-600">
          {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
        </div>

        <div className="space-y-4">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                    {provider.credentials && (
                      <span className="text-sm text-gray-500">{provider.credentials}</span>
                    )}
                  </div>

                  {/* Rating */}
                  {provider.review_count > 0 && (
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-700">
                        {provider.rating.toFixed(1)} ({provider.review_count} reviews)
                      </span>
                    </div>
                  )}

                  {/* Specialties */}
                  {provider.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {provider.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  {provider.bio && (
                    <p className="mt-3 text-gray-600 line-clamp-3">{provider.bio}</p>
                  )}

                  {/* Location & Contact */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    {provider.city && provider.state && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {provider.city}, {provider.state}
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {provider.phone}
                      </div>
                    )}
                    {provider.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {provider.email}
                      </div>
                    )}
                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {provider.telehealth_available && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Telehealth
                      </span>
                    )}
                    {provider.faith_based && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Faith-Based
                      </span>
                    )}
                    {provider.accepting_new_clients && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Accepting New Clients
                      </span>
                    )}
                  </div>
                </div>

                {/* Save button */}
                {userId && (
                  <button
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Save provider"
                  >
                    <Heart className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No providers found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialties([])
                  setTelehealth(false)
                  setFaithBased(false)
                  setAcceptingClients(false)
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
