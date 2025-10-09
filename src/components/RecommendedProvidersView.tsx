'use client'

import { useMemo } from 'react'
import { MapPin, Star, Phone, Mail, Globe, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/types/database.types'

type CarePlan = Database['public']['Tables']['care_plans']['Row']
type Provider = Database['public']['Tables']['providers']['Row']

interface RecommendedProvidersViewProps {
  carePlan: CarePlan
  allProviders: Provider[]
}

interface ProviderMatch {
  provider: Provider
  matchScore: number
  reasons: string[]
}

interface AssessmentData {
  concerns?: string[]
  faithIntegration?: boolean
  denomination?: string
  insuranceType?: string
  preferredFormat?: string
  timeCommitment?: string
  stressLevel?: number
}

export default function RecommendedProvidersView({ carePlan, allProviders }: RecommendedProvidersViewProps) {
  const assessmentData = carePlan.assessment_data as AssessmentData

  // AI-based provider matching logic
  const recommendedProviders = useMemo(() => {
    const matches: ProviderMatch[] = []

    allProviders.forEach(provider => {
      let score = 0
      const reasons: string[] = []

      // Match based on concerns from assessment
      if (assessmentData.concerns && Array.isArray(assessmentData.concerns)) {
        const concernMatches = assessmentData.concerns.filter((concern: string) =>
          provider.specialties.some(specialty =>
            specialty.toLowerCase().includes(concern.toLowerCase()) ||
            concern.toLowerCase().includes(specialty.toLowerCase())
          )
        )
        if (concernMatches.length > 0) {
          score += concernMatches.length * 20
          reasons.push(`Specializes in ${concernMatches.slice(0, 2).join(' and ')}`)
        }
      }

      // Match based on faith integration preference
      if (assessmentData.faithIntegration && provider.denominations.length > 0) {
        score += 15
        reasons.push('Offers faith-integrated care')
      }

      // Match based on denomination
      if (assessmentData.denomination && provider.denominations.includes(assessmentData.denomination)) {
        score += 10
        reasons.push(`Familiar with ${assessmentData.denomination} traditions`)
      }

      // Match based on insurance
      if (assessmentData.insuranceType && provider.insurance_accepted.includes(assessmentData.insuranceType)) {
        score += 15
        reasons.push(`Accepts ${assessmentData.insuranceType}`)
      }

      // Match based on preferred format
      if (assessmentData.preferredFormat) {
        if (assessmentData.preferredFormat.toLowerCase().includes('virtual') &&
            (provider.location_type === 'virtual' || provider.location_type === 'both')) {
          score += 10
          reasons.push('Offers virtual/telehealth sessions')
        }
        if (assessmentData.preferredFormat.toLowerCase().includes('in-person') &&
            (provider.location_type === 'in-person' || provider.location_type === 'both')) {
          score += 10
          reasons.push('Offers in-person sessions')
        }
      }

      // Match based on time commitment preference
      if (assessmentData.timeCommitment) {
        if (assessmentData.timeCommitment.toLowerCase().includes('retreat') && provider.retreat_facilitated) {
          score += 15
          reasons.push('Facilitates retreats for ministry leaders')
        }
        if (assessmentData.timeCommitment.toLowerCase().includes('weekend') &&
            provider.service_durations.some(d => d.toLowerCase().includes('weekend'))) {
          score += 10
          reasons.push('Offers weekend intensive programs')
        }
      }

      // Bonus for licensed therapists if stress level is high
      if (assessmentData.stressLevel && assessmentData.stressLevel >= 7 && provider.actual_therapists) {
        score += 15
        reasons.push('Licensed therapists on staff for high-stress situations')
      }

      // Bonus for high ratings
      if (provider.rating >= 4.5) {
        score += 10
        reasons.push(`Highly rated (${provider.rating.toFixed(1)}/5.0)`)
      }

      // Bonus for content resources if seeking additional support
      if (provider.content_resources && provider.content_resources_list.length > 0) {
        score += 5
        reasons.push(`Provides ${provider.content_resources_list.slice(0, 2).join(' and ')}`)
      }

      // Bonus for relational support matching needs
      if (provider.general_relational_support.length > 0) {
        score += 5
        const supportTypes = provider.general_relational_support.slice(0, 2).join(' and ')
        reasons.push(`Offers ${supportTypes}`)
      }

      // Bonus for benevolence if financial concerns exist
      if (provider.benevolence_request) {
        score += 5
        reasons.push('Financial assistance available')
      }

      // Only include providers with a match score
      if (score > 0) {
        matches.push({ provider, matchScore: score, reasons })
      }
    })

    // Sort by match score and return top 10
    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10)
  }, [allProviders, assessmentData])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">AI-Recommended Providers</h1>
        </div>
        <p className="text-gray-600">
          Based on your care plan and assessment, we&apos;ve identified these providers as the best matches for your needs.
          Each recommendation includes specific reasons why this provider may be a good fit for you.
        </p>
      </div>

      {recommendedProviders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find any providers matching your specific criteria.
          </p>
          <Link
            href="/providers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Providers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedProviders.map(({ provider, matchScore, reasons }, index) => (
            <div key={provider.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      #{index + 1}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                      {provider.credentials && (
                        <span className="text-sm text-gray-500">{provider.credentials}</span>
                      )}
                    </div>
                    {provider.review_count > 0 && (
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-700">
                          {provider.rating.toFixed(1)} ({provider.review_count} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{matchScore}% Match</span>
                </div>
              </div>

              {/* Why This Provider */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Why We Recommend This Provider
                </h4>
                <ul className="space-y-1">
                  {reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-blue-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specialties */}
              {provider.specialties.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {provider.specialties.slice(0, 4).map(specialty => (
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
                <p className="text-gray-600 mb-4 line-clamp-2">{provider.bio}</p>
              )}

              {/* Contact & Location */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
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
              <div className="flex flex-wrap gap-2">
                {provider.location_type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {provider.location_type === 'in-person' ? 'In-Person' : provider.location_type === 'virtual' ? 'Virtual' : 'In-Person & Virtual'}
                  </span>
                )}
                {provider.accepting_new_clients && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Accepting New Clients
                  </span>
                )}
                {provider.gloo_scholarship_available && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Gloo Impact Scholarships
                  </span>
                )}
                {provider.retreat_facilitated && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    Retreat Facilitated
                  </span>
                )}
                {provider.actual_therapists && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Licensed Therapists
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Not finding what you need?</h3>
        <p className="text-gray-600 mb-4">
          Browse our complete provider directory to explore all available options and use filters to find providers that match your preferences.
        </p>
        <Link
          href="/providers"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse All Providers
        </Link>
      </div>
    </div>
  )
}
