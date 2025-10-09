'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { AlertCircle, CheckCircle, Clock, Heart, Plus, X, Send, Download } from 'lucide-react'
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
  logo?: string;
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
  const [showPopup, setShowPopup] = useState(false)
  const [customItems, setCustomItems] = useState<Array<{description: string, cost: number}>>([])
  const [customDescription, setCustomDescription] = useState('')
  const [customCost, setCustomCost] = useState('')
  const [planSent, setPlanSent] = useState(false)

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

    // Add custom items to total
    customItems.forEach(item => {
      total += item.cost
    })

    return total
  }, [selectedItems, recommendations, customItems])

  const handleSendToBoard = () => {
    setPlanSent(true)
    setShowPopup(true)
    // Auto-hide popup after 5 seconds
    setTimeout(() => {
      setShowPopup(false)
    }, 5000)
  }

  const handleAddCustomItem = () => {
    if (customDescription.trim() && customCost) {
      const cost = parseFloat(customCost)
      if (!isNaN(cost) && cost >= 0) {
        setCustomItems([...customItems, { description: customDescription.trim(), cost }])
        setCustomDescription('')
        setCustomCost('')
      }
    }
  }

  const handleRemoveCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index))
  }

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
        <p className="text-gray-600 mb-4">
          Created on {new Date(carePlan.created_at).toLocaleDateString()}
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-blue-900 mb-1">
                Build Your Care Plan
              </h3>
              <p className="text-sm text-blue-800">
                Click the <strong>+ button</strong> next to any recommendation to add it to your plan.
                Selected items will be highlighted and counted in your budget total below.
                You can also add your own custom items at the bottom of the page.
              </p>
            </div>
          </div>
        </div>
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
                    className={`ml-4 transition-all ${
                      isSelected
                        ? 'p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600'
                        : 'p-3 rounded-lg font-medium text-sm min-w-[100px] bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-600'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </span>
                    )}
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
                    className={`ml-4 transition-all ${
                      isSelected
                        ? 'p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600'
                        : 'p-3 rounded-lg font-medium text-sm min-w-[100px] bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-600'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </span>
                    )}
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
                    className={`ml-4 transition-all ${
                      isSelected
                        ? 'p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600'
                        : 'p-3 rounded-lg font-medium text-sm min-w-[100px] bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-600'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </span>
                    )}
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
                      {item.logo && (
                        <Image src={item.logo} alt="Gloo Impact" width={60} height={16} className="h-4 w-auto" />
                      )}
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
                    className={`ml-4 transition-all ${
                      isSelected
                        ? 'p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600'
                        : 'p-3 rounded-lg font-medium text-sm min-w-[100px] bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-600'
                    }`}
                    aria-label={isSelected ? "Remove from plan" : "Add to plan"}
                  >
                    {isSelected ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom Items Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Plus className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Add Your Own Items</h2>
        </div>

        {/* Display existing custom items */}
        {customItems.length > 0 && (
          <div className="space-y-3 mb-6">
            {customItems.map((item, index) => (
              <div key={index} className="border-l-4 border-gray-500 pl-4 flex items-start justify-between bg-gray-50 rounded-r p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{item.description}</h3>
                    <span className="text-sm font-semibold text-green-700">
                      ${item.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCustomItem(index)}
                  className="ml-4 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600 transition-colors"
                  aria-label="Remove custom item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input form for new custom item */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Description
            </label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="e.g., Additional therapy sessions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Cost ($)
            </label>
            <input
              type="number"
              value={customCost}
              onChange={(e) => setCustomCost(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <button
            onClick={handleAddCustomItem}
            disabled={!customDescription.trim() || !customCost}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Custom Item
          </button>
        </div>
      </div>

      {/* Budget Total */}
      {(selectedItems.size > 0 || customItems.length > 0) && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 text-lg">Budget Total</h3>
              <p className="text-sm text-green-700 mt-1">
                {selectedItems.size + customItems.length} {selectedItems.size + customItems.length === 1 ? 'item' : 'items'} selected
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
          {planSent ? (
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-md">
              <CheckCircle className="h-4 w-4 mr-2" />
              Plan Sent
            </div>
          ) : (
            <button
              onClick={handleSendToBoard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Plan to Board
            </button>
          )}

          <a
            href="/recommended-providers"
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              planSent
                ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Find a Provider
          </a>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your plan is on the way!
              </h3>
              <p className="text-gray-600 mb-6">
                You will hear back in 48 hours
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
