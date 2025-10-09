'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, Star, Heart, Phone, Mail, Globe, ChevronDown } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Provider = Database['public']['Tables']['providers']['Row']

interface ProviderSearchProps {
  initialProviders: Provider[]
  userId?: string
}

export default function ProviderSearch({ initialProviders, userId }: ProviderSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedDuration, setSelectedDuration] = useState<string>('')
  const [selectedDenomination, setSelectedDenomination] = useState<string>('')
  const [locationType, setLocationType] = useState<string>('')
  const [glooScholarship, setGlooScholarship] = useState(false)
  const [selectedContentResource, setSelectedContentResource] = useState<string>('')
  const [acceptingClients, setAcceptingClients] = useState(false)
  const [retreatFacilitated, setRetreatFacilitated] = useState(false)
  const [actualTherapists, setActualTherapists] = useState(false)
  const [selectedRelationalSupport, setSelectedRelationalSupport] = useState<string>('')
  const [benevolenceRequest, setBenevolenceRequest] = useState(false)
  const [specialtiesExpanded, setSpecialtiesExpanded] = useState(false)

  // Get all unique specialties
  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>()
    initialProviders.forEach(provider => {
      provider.specialties.forEach(specialty => specialtiesSet.add(specialty))
    })
    return Array.from(specialtiesSet).sort()
  }, [initialProviders])

  // Fixed dropdown options
  const durationOptions = ['Day', 'Weekend', 'Week', 'Year-long']
  const contentResourceOptions = ['Books', 'Online Courses', 'Podcast']
  const denominationOptions = [
    'Catholic',
    'Pentecostal',
    'Baptist',
    'Methodist',
    'Lutheran',
    'Presbyterian',
    'Anglican/Episcopal',
    'Non-denominational',
    'Assembly of God',
    'Church of Christ',
    'Evangelical',
    'Reformed'
  ]
  const relationalSupportOptions = [
    'Spiritual Directors',
    'Exec/Leadership Coaches',
    'Financial Guides',
    'Nutrition/Health Coaches',
    'Mentors'
  ]

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

      // Duration filter
      const matchesDuration = !selectedDuration ||
        provider.service_durations.includes(selectedDuration)

      // Denomination filter
      const matchesDenomination = !selectedDenomination ||
        provider.denominations.includes(selectedDenomination)

      // Content resource filter
      const matchesContentResource = !selectedContentResource ||
        provider.content_resources_list.includes(selectedContentResource)

      // Relational support filter
      const matchesRelationalSupport = !selectedRelationalSupport ||
        provider.general_relational_support.includes(selectedRelationalSupport)

      // Location type filter
      const matchesLocationType = !locationType || provider.location_type === locationType || provider.location_type === 'both'

      // Other filters
      const matchesGloo = !glooScholarship || provider.gloo_scholarship_available
      const matchesAccepting = !acceptingClients || provider.accepting_new_clients
      const matchesRetreat = !retreatFacilitated || provider.retreat_facilitated
      const matchesTherapists = !actualTherapists || provider.actual_therapists
      const matchesBenevolence = !benevolenceRequest || provider.benevolence_request

      return matchesSearch && matchesSpecialty && matchesDuration && matchesDenomination &&
             matchesLocationType && matchesGloo && matchesContentResource && matchesAccepting &&
             matchesRelationalSupport && matchesRetreat && matchesTherapists && matchesBenevolence
    })
  }, [initialProviders, searchTerm, selectedSpecialties, selectedDuration, selectedDenomination,
      locationType, glooScholarship, selectedContentResource, acceptingClients, selectedRelationalSupport,
      retreatFacilitated, actualTherapists, benevolenceRequest])

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
        <div className="bg-white rounded-lg shadow p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
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

          {/* Service Durations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All</option>
              {durationOptions.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>

          {/* Content Resources */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Resources
            </label>
            <select
              value={selectedContentResource}
              onChange={(e) => setSelectedContentResource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All</option>
              {contentResourceOptions.map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>

          {/* Denominations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Denominations/Theology
            </label>
            <select
              value={selectedDenomination}
              onChange={(e) => setSelectedDenomination(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All</option>
              {denominationOptions.map(denomination => (
                <option key={denomination} value={denomination}>{denomination}</option>
              ))}
            </select>
          </div>

          {/* General Relational Support */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Relational Support
            </label>
            <select
              value={selectedRelationalSupport}
              onChange={(e) => setSelectedRelationalSupport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All</option>
              {relationalSupportOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Location Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Type
            </label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="">All</option>
              <option value="in-person">In-Person</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          {/* Other Filters */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={acceptingClients}
                onChange={(e) => setAcceptingClients(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Accepting New Clients</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={glooScholarship}
                onChange={(e) => setGlooScholarship(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Gloo Impact Scholarships</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={retreatFacilitated}
                onChange={(e) => setRetreatFacilitated(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Retreat Facilitated</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={actualTherapists}
                onChange={(e) => setActualTherapists(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Actual Therapists</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={benevolenceRequest}
                onChange={(e) => setBenevolenceRequest(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Benevolence Request</span>
            </label>
          </div>

          {/* Specialties */}
          <div className="mt-6 border-t pt-4">
            <button
              onClick={() => setSpecialtiesExpanded(!specialtiesExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>
                Specialties
                {selectedSpecialties.length > 0 && (
                  <span className="ml-2 text-xs text-blue-600">({selectedSpecialties.length} selected)</span>
                )}
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${specialtiesExpanded ? 'transform rotate-180' : ''}`}
              />
            </button>
            {specialtiesExpanded && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
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
            )}
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

                  {/* Service Durations */}
                  {provider.service_durations.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Service Durations: </span>
                      <span className="text-sm text-gray-600">{provider.service_durations.join(', ')}</span>
                    </div>
                  )}

                  {/* Denominations */}
                  {provider.denominations.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Denominations: </span>
                      <span className="text-sm text-gray-600">{provider.denominations.join(', ')}</span>
                    </div>
                  )}

                  {/* General Relational Support */}
                  {provider.general_relational_support.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Relational Support: </span>
                      <span className="text-sm text-gray-600">{provider.general_relational_support.join(', ')}</span>
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
                    {provider.location_type && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {provider.location_type === 'in-person' ? 'In-Person' : provider.location_type === 'virtual' ? 'Virtual' : 'In-Person & Virtual'}
                      </span>
                    )}
                    {provider.accepting_new_clients && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Accepting New Clients
                      </span>
                    )}
                    {provider.gloo_scholarship_available && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Gloo Impact Scholarships
                      </span>
                    )}
                    {provider.content_resources && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        Content Resources
                      </span>
                    )}
                    {provider.retreat_facilitated && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        Retreat Facilitated
                      </span>
                    )}
                    {provider.actual_therapists && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Licensed Therapists
                      </span>
                    )}
                    {provider.benevolence_request && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Benevolence Available
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
                  setSelectedDuration('')
                  setSelectedDenomination('')
                  setSelectedContentResource('')
                  setSelectedRelationalSupport('')
                  setLocationType('')
                  setGlooScholarship(false)
                  setAcceptingClients(false)
                  setRetreatFacilitated(false)
                  setActualTherapists(false)
                  setBenevolenceRequest(false)
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
