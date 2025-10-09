'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AssessmentFormProps {
  userId: string
}

interface AssessmentData {
  stressLevel: string
  primaryConcerns: string[]
  duration: string
  supportSystem: string
  previousTherapy: string
  specificChallenges: string
  goals: string
  preferences: {
    telehealth: boolean
    faithBased: boolean
    groupTherapy: boolean
  }
}

export default function AssessmentForm({ userId }: AssessmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<AssessmentData>({
    stressLevel: '',
    primaryConcerns: [],
    duration: '',
    supportSystem: '',
    previousTherapy: '',
    specificChallenges: '',
    goals: '',
    preferences: {
      telehealth: false,
      faithBased: false,
      groupTherapy: false,
    }
  })

  const concerns = [
    'Burnout',
    'Anxiety',
    'Depression',
    'Work-Life Balance',
    'Relationship Issues',
    'Grief/Loss',
    'Spiritual Crisis',
    'Moral Injury',
    'Compassion Fatigue',
    'Other'
  ]

  const toggleConcern = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      primaryConcerns: prev.primaryConcerns.includes(concern)
        ? prev.primaryConcerns.filter(c => c !== concern)
        : [...prev.primaryConcerns, concern]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Generate recommendations based on assessment
      const recommendations = generateRecommendations(formData)

      // Determine priority level
      const priorityLevel = determinePriorityLevel(formData)

      // Create care plan
      const { error } = await supabase
        .from('care_plans')
        .insert({
          user_id: userId,
          assessment_data: formData,
          recommendations: recommendations,
          priority_level: priorityLevel,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      router.push('/care-plan')
    } catch (error) {
      console.error('Error creating care plan:', error)
      alert('Failed to create care plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = (data: AssessmentData) => {
    const recommendations: {
      immediate: Array<{ title: string; description: string; priority?: string }>;
      shortTerm: Array<{ title: string; description: string }>;
      longTerm: Array<{ title: string; description: string }>;
      resources: Array<{ title: string; description: string }>;
    } = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      resources: []
    }

    // Immediate actions based on stress level
    if (data.stressLevel === 'severe' || data.stressLevel === 'crisis') {
      recommendations.immediate.push({
        title: 'Immediate Support',
        description: 'Consider reaching out to a crisis helpline or emergency services if you are in immediate danger.',
        priority: 'urgent'
      })
    }

    // Therapy recommendations
    if (data.preferences.faithBased) {
      recommendations.shortTerm.push({
        title: 'Faith-Based Counseling',
        description: 'Connect with a mental health professional who can integrate your faith perspective into treatment.'
      })
    }

    if (data.preferences.telehealth) {
      recommendations.shortTerm.push({
        title: 'Telehealth Options',
        description: 'Explore online therapy options for flexible scheduling and convenience.'
      })
    }

    // Concern-specific recommendations
    if (data.primaryConcerns.includes('Burnout')) {
      recommendations.shortTerm.push({
        title: 'Burnout Prevention',
        description: 'Work with a therapist on establishing healthy boundaries and self-care routines.'
      })
      recommendations.resources.push({
        title: 'Sabbath and Rest Practices',
        description: 'Resources for implementing regular rest and renewal practices.'
      })
    }

    if (data.primaryConcerns.includes('Compassion Fatigue')) {
      recommendations.longTerm.push({
        title: 'Compassion Fatigue Management',
        description: 'Develop sustainable caregiving practices and emotional resilience strategies.'
      })
    }

    // General recommendations
    recommendations.longTerm.push({
      title: 'Regular Therapy',
      description: 'Establish a consistent therapeutic relationship for ongoing support.'
    })

    recommendations.resources.push({
      title: 'Support Groups',
      description: 'Connect with other ministry leaders facing similar challenges.'
    })

    return recommendations
  }

  const determinePriorityLevel = (data: AssessmentData): 'low' | 'medium' | 'high' | 'urgent' => {
    if (data.stressLevel === 'crisis') return 'urgent'
    if (data.stressLevel === 'severe') return 'high'
    if (data.stressLevel === 'moderate') return 'medium'
    return 'low'
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current stress/distress level *
            </label>
            <select
              required
              value={formData.stressLevel}
              onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a level</option>
              <option value="minimal">Minimal - Managing well</option>
              <option value="mild">Mild - Some difficulty</option>
              <option value="moderate">Moderate - Significantly impacting daily life</option>
              <option value="severe">Severe - Very difficult to function</option>
              <option value="crisis">Crisis - Need immediate help</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary concerns (select all that apply) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concerns.map(concern => (
                <label key={concern} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.primaryConcerns.includes(concern)}
                    onChange={() => toggleConcern(concern)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{concern}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long have you been experiencing these concerns? *
            </label>
            <select
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select duration</option>
              <option value="recent">Less than 1 month</option>
              <option value="1-3months">1-3 months</option>
              <option value="3-6months">3-6 months</option>
              <option value="6-12months">6-12 months</option>
              <option value="over1year">Over 1 year</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={!formData.stressLevel || formData.primaryConcerns.length === 0 || !formData.duration}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current support system *
            </label>
            <textarea
              required
              value={formData.supportSystem}
              onChange={(e) => setFormData({ ...formData, supportSystem: e.target.value })}
              rows={3}
              placeholder="Who do you currently turn to for support? (family, friends, colleagues, etc.)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous therapy or counseling experience *
            </label>
            <select
              required
              value={formData.previousTherapy}
              onChange={(e) => setFormData({ ...formData, previousTherapy: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select option</option>
              <option value="none">No previous therapy</option>
              <option value="past">Yes, in the past</option>
              <option value="current">Currently in therapy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific challenges related to ministry/leadership
            </label>
            <textarea
              value={formData.specificChallenges}
              onChange={(e) => setFormData({ ...formData, specificChallenges: e.target.value })}
              rows={4}
              placeholder="Describe any unique challenges you face as a ministry leader..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={!formData.supportSystem || !formData.previousTherapy}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are your goals for therapy/counseling? *
            </label>
            <textarea
              required
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={4}
              placeholder="What would you like to achieve through mental health support?"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Care preferences
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferences.telehealth}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, telehealth: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Interested in telehealth/online therapy</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferences.faithBased}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, faithBased: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Prefer faith-based counseling</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferences.groupTherapy}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, groupTherapy: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Open to group therapy/support groups</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !formData.goals}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Care Plan...' : 'Generate Care Plan'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-2 w-2 rounded-full ${
              step === currentStep ? 'bg-blue-600' : step < currentStep ? 'bg-blue-300' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </form>
  )
}
