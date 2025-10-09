'use client'

import { useState } from 'react'
import { User, MapPin, FileText, DollarSign, Calendar, Heart, CheckCircle } from 'lucide-react'

export default function ProviderApplicationForm() {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    credentials: '',
    email: '',
    phone: '',
    website: '',

    // Location
    city: '',
    state: '',
    locationType: 'in-person' as 'in-person' | 'virtual',

    // Professional Details
    bio: '',
    specialties: [] as string[],
    denominations: [] as string[],
    yearsExperience: '',

    // Services Offered
    serviceDurations: [] as string[],
    contentResources: '',
    insuranceAccepted: [] as string[],

    // Specific Offerings
    retreatFacilitated: false,
    actualTherapists: false,
    relationalSupport: [] as string[],
    benevolenceRequest: false,
    glooScholarship: false,
    acceptingNewClients: true,

    // Additional Information
    additionalInfo: ''
  })

  const [customSpecialty, setCustomSpecialty] = useState('')
  const [customDenomination, setCustomDenomination] = useState('')
  const [customInsurance, setCustomInsurance] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const specialtyOptions = [
    'Anxiety', 'Burnout', 'Depression', 'Trauma', 'Marriage Counseling',
    'Family Therapy', 'Grief', 'Addiction', 'Stress Management',
    'Leadership Development', 'Spiritual Direction', 'Compassion Fatigue'
  ]

  const denominationOptions = [
    'Catholic', 'Pentecostal', 'Baptist', 'Methodist', 'Lutheran',
    'Presbyterian', 'Anglican/Episcopal', 'Non-denominational',
    'Assembly of God', 'Church of Christ', 'Evangelical', 'Reformed'
  ]

  const durationOptions = ['Day', 'Weekend', 'Week', 'Year-long']

  const insuranceOptions = [
    'Blue Cross Blue Shield', 'Aetna', 'United Healthcare', 'Cigna',
    'Humana', 'Medicare', 'Medicaid', 'Out-of-pocket/Self-pay'
  ]

  const relationalSupportOptions = [
    'Spiritual Directors', 'Exec/Leadership Coaches', 'Financial Guides',
    'Nutrition/Health Coaches', 'Mentors'
  ]

  const handleCheckboxChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...currentArray, value] }
      }
    })
  }

  const addCustomItem = (field: keyof typeof formData, value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }))
      setValue('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would normally send to an API endpoint
    console.log('Application submitted:', formData)

    // For now, just show success message
    setSubmitted(true)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for applying to join Leader Care. Our team will review your application and contact you within 5-7 business days.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit Another Application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section>
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credentials
            </label>
            <input
              type="text"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ph.D., LMFT, LPC"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Location</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nashville"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="TN"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="in-person"
                  checked={formData.locationType === 'in-person'}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value as 'in-person' | 'virtual' })}
                  className="mr-2"
                />
                In-Person
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="virtual"
                  checked={formData.locationType === 'virtual'}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value as 'in-person' | 'virtual' })}
                  className="mr-2"
                />
                Virtual
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Details */}
      <section>
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Professional Details</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio *
            </label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your experience, approach, and what makes you passionate about serving ministry leaders..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specialtyOptions.map(specialty => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleCheckboxChange('specialties', specialty)}
                    className="mr-2"
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom specialty"
              />
              <button
                type="button"
                onClick={() => addCustomItem('specialties', customSpecialty, setCustomSpecialty)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.specialties.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.specialties.map(specialty => (
                  <span key={specialty} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange('specialties', specialty)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Denominations Familiar With
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {denominationOptions.map(denomination => (
                <label key={denomination} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.denominations.includes(denomination)}
                    onChange={() => handleCheckboxChange('denominations', denomination)}
                    className="mr-2"
                  />
                  <span className="text-sm">{denomination}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customDenomination}
                onChange={(e) => setCustomDenomination(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom denomination"
              />
              <button
                type="button"
                onClick={() => addCustomItem('denominations', customDenomination, setCustomDenomination)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.denominations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.denominations.map(denomination => (
                  <span key={denomination} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {denomination}
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange('denominations', denomination)}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section>
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Services Offered</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Durations
            </label>
            <div className="flex flex-wrap gap-4">
              {durationOptions.map(duration => (
                <label key={duration} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.serviceDurations.includes(duration)}
                    onChange={() => handleCheckboxChange('serviceDurations', duration)}
                    className="mr-2"
                  />
                  {duration}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Resources Available
            </label>
            <input
              type="text"
              value={formData.contentResources}
              onChange={(e) => setFormData({ ...formData, contentResources: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Books, Online Courses, Podcast"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Accepted
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {insuranceOptions.map(insurance => (
                <label key={insurance} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.insuranceAccepted.includes(insurance)}
                    onChange={() => handleCheckboxChange('insuranceAccepted', insurance)}
                    className="mr-2"
                  />
                  <span className="text-sm">{insurance}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customInsurance}
                onChange={(e) => setCustomInsurance(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add other insurance"
              />
              <button
                type="button"
                onClick={() => addCustomItem('insuranceAccepted', customInsurance, setCustomInsurance)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.insuranceAccepted.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.insuranceAccepted.map(insurance => (
                  <span key={insurance} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {insurance}
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange('insuranceAccepted', insurance)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specific Offerings */}
      <section>
        <div className="flex items-center mb-4">
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Specific Offerings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Relational Support Offered
            </label>
            <div className="space-y-2">
              {relationalSupportOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.relationalSupport.includes(option)}
                    onChange={() => handleCheckboxChange('relationalSupport', option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.retreatFacilitated}
                onChange={(e) => setFormData({ ...formData, retreatFacilitated: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">I facilitate retreats for ministry leaders</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.actualTherapists}
                onChange={(e) => setFormData({ ...formData, actualTherapists: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">I am a licensed therapist or have licensed therapists on staff</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.benevolenceRequest}
                onChange={(e) => setFormData({ ...formData, benevolenceRequest: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">I accept benevolence/financial assistance requests</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.glooScholarship}
                onChange={(e) => setFormData({ ...formData, glooScholarship: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">I accept Gloo Impact Scholarships</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acceptingNewClients}
                onChange={(e) => setFormData({ ...formData, acceptingNewClients: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">I am currently accepting new clients</span>
            </label>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <div className="flex items-center mb-4">
          <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any other information you would like us to know about your practice or services..."
            />
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}
