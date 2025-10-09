'use client'

import { AlertCircle, CheckCircle, Clock, Heart } from 'lucide-react'
import type { Database } from '@/types/database.types'

type CarePlan = Database['public']['Tables']['care_plans']['Row']

interface CarePlanViewProps {
  carePlan: CarePlan
}

interface Recommendation {
  title: string;
  description: string;
  priority?: string;
}

interface Recommendations {
  immediate?: Recommendation[];
  shortTerm?: Recommendation[];
  longTerm?: Recommendation[];
  resources?: Recommendation[];
}

export default function CarePlanView({ carePlan }: CarePlanViewProps) {
  const recommendations = carePlan.recommendations as Recommendations

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Personalized Care Plan</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(carePlan.priority_level)}`}>
            {carePlan.priority_level.toUpperCase()} Priority
          </span>
        </div>
        <p className="text-gray-600">
          Created on {new Date(carePlan.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Immediate Actions */}
      {recommendations.immediate?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Immediate Actions</h2>
          </div>
          <div className="space-y-4">
            {recommendations.immediate.map((item, index: number) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Short-term Recommendations */}
      {recommendations.shortTerm?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Short-term Recommendations</h2>
          </div>
          <div className="space-y-4">
            {recommendations.shortTerm.map((item, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long-term Goals */}
      {recommendations.longTerm?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Long-term Goals</h2>
          </div>
          <div className="space-y-4">
            {recommendations.longTerm.map((item, index: number) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {recommendations.resources?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Helpful Resources</h2>
          </div>
          <div className="space-y-4">
            {recommendations.resources.map((item, index: number) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Review your personalized recommendations</li>
          <li>Browse our provider directory to find a therapist that fits your needs</li>
          <li>Schedule an initial consultation</li>
          <li>Return to update your care plan as your needs evolve</li>
        </ul>
        <div className="mt-4">
          <a
            href="/providers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Find a Provider
          </a>
        </div>
      </div>
    </div>
  )
}
