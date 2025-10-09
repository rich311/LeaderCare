'use client'

import { useState, useMemo } from 'react'
import { AlertCircle, CheckCircle, Clock, Heart, Plus, X, Send } from 'lucide-react'
import type { Database } from '@/types/database.types'

type CarePlan = Database['public']['Tables']['care_plans']['Row']

interface CarePlanViewProps {
  carePlan: CarePlan
}

interface Recommendation {
  title: string;
  description: string;
  priority?: string;
  estimatedCost?: number;
}

interface Recommendations {
  immediate?: Recommendation[];
  shortTerm?: Recommendation[];
  longTerm?: Recommendation[];
  resources?: Recommendation[];
}

export default function CarePlanView({ carePlan }: CarePlanViewProps) {
  const recommendations = carePlan.recommendations as Recommendations
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const isItemSelected = (category: string, index: number) => {
    return selectedItems.has(`${category}-${index}`)
  }

  const budgetTotal = useMemo(() => {
    let total = 0
    const categories = [
      { name: 'immediate', items: recommendations.immediate },
      { name: 'shortTerm', items: recommendations.shortTerm },
      { name: 'longTerm', items: recommendations.longTerm },
      { name: 'resources', items: recommendations.resources }
    ]

    categories.forEach(({ name, items }) => {
      items?.forEach((item, index) => {
        if (isItemSelected(name, index) && item.estimatedCost) {
          total += item.estimatedCost
        }
      })
    })

    return total
  }, [selectedItems, recommendations])

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
      {recommendations.immediate && recommendations.immediate.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Immediate Actions</h2>
          </div>
          <div className="space-y-4">
            {recommendations.immediate.map((item, index: number) => {
              const isSelected = isItemSelected('immediate', index)
              return (
                <div key={index} className={`border-l-4 border-red-500 pl-4 flex items-start justify-between ${isSelected ? 'bg-blue-50' : ''} rounded-r transition-colors`}>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.estimatedCost && (
                        <span className="text-sm font-semibold text-green-700">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleItem('immediate', index)}
                    className={`ml-4 p-2 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                    title={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Short-term Recommendations */}
      {recommendations.shortTerm && recommendations.shortTerm.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Short-term Recommendations</h2>
          </div>
          <div className="space-y-4">
            {recommendations.shortTerm.map((item, index: number) => {
              const isSelected = isItemSelected('shortTerm', index)
              return (
                <div key={index} className={`border-l-4 border-blue-500 pl-4 flex items-start justify-between ${isSelected ? 'bg-blue-50' : ''} rounded-r transition-colors`}>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.estimatedCost && (
                        <span className="text-sm font-semibold text-green-700">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleItem('shortTerm', index)}
                    className={`ml-4 p-2 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                    title={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Long-term Goals */}
      {recommendations.longTerm && recommendations.longTerm.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Long-term Goals</h2>
          </div>
          <div className="space-y-4">
            {recommendations.longTerm.map((item, index: number) => {
              const isSelected = isItemSelected('longTerm', index)
              return (
                <div key={index} className={`border-l-4 border-green-500 pl-4 flex items-start justify-between ${isSelected ? 'bg-blue-50' : ''} rounded-r transition-colors`}>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.estimatedCost && (
                        <span className="text-sm font-semibold text-green-700">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleItem('longTerm', index)}
                    className={`ml-4 p-2 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                    title={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resources */}
      {recommendations.resources && recommendations.resources.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Helpful Resources</h2>
          </div>
          <div className="space-y-4">
            {recommendations.resources.map((item, index: number) => {
              const isSelected = isItemSelected('resources', index)
              return (
                <div key={index} className={`border-l-4 border-purple-500 pl-4 flex items-start justify-between ${isSelected ? 'bg-blue-50' : ''} rounded-r transition-colors`}>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.estimatedCost && (
                        <span className="text-sm font-semibold text-green-700">
                          ${item.estimatedCost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleItem('resources', index)}
                    className={`ml-4 p-2 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                    title={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budget Total */}
      {selectedItems.size > 0 && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 text-lg">Budget Total</h3>
              <p className="text-sm text-green-700 mt-1">
                {selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">
                ${budgetTotal.toLocaleString()}
              </div>
              <p className="text-sm text-green-700 mt-1">Estimated total cost</p>
            </div>
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
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/recommended-providers"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Find a Provider
          </a>
          <button
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Plan to Board
          </button>
        </div>
      </div>
    </div>
  )
}
