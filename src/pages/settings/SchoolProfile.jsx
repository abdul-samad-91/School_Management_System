import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '../../components/ui/Button'
import { schoolAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'

const Toggle = ({ label, defaultChecked = false }) => {
  return (
    <div className="flex   gap-4 flex-col">
      <span className="text-lg font-medium text-gray-700">{label}</span>
      <div className="flex items-center justify-between gap-10 px-4 py-2 bg-gray-200 rounded">
        <span className="text-lg font-semibold text-gray-900">OFF</span>
        <label className="relative inline-flex cursor-pointer items-center ">
          <input type="checkbox" className="peer sr-only" defaultChecked={defaultChecked} />
          <span className="h-3 w-9 rounded-full bg-gray-500 transition-colors peer-checked:bg-primary-600" />
          <span className="absolute left-0.2 top-0.2 h-5 w-5 rounded-full bg-gray-300 transition-transform peer-checked:translate-x-4" />
        </label>
      </div>
    </div>
  )
}

const SchoolProfile = () => {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '', phone: '', email: '', registrationNumber: '', address: '',
  })
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoFileRef = useRef(null)

  const { data: schoolData } = useQuery({
    queryKey: ['school-profile'],
    queryFn: async () => {
      const response = await schoolAPI.getProfile()
      return response.data?.data || null
    },
  })

  useEffect(() => {
    if (schoolData) {
      setProfileData({
        name: schoolData.name || '',
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        registrationNumber: schoolData.registrationNumber || '',
        address: schoolData.address || '',
      })
    }
  }, [schoolData])

  const handleFieldChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoClick = () => {
    logoFileRef.current?.click()
  }

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
    if (!schoolData?._id) {
      toast.error('Save the school profile first before uploading a logo')
      return
    }
    try {
      setLogoUploading(true)
      const form = new FormData()
      form.append('logo', file)
      await schoolAPI.updateProfile(schoolData._id, form)
      queryClient.invalidateQueries({ queryKey: ['school-profile'] })
      toast.success('Logo updated successfully')
    } catch (error) {
      toast.error(handleError(error) || 'Failed to upload logo')
      setLogoPreview(null)
    } finally {
      setLogoUploading(false)
      if (logoFileRef.current) logoFileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      const payload = {}
      if (profileData.name) payload.name = profileData.name
      if (profileData.email) payload.contact = { email: profileData.email }
      if (profileData.registrationNumber) payload.registration = { number: profileData.registrationNumber }
      if (schoolData?._id) {
        await schoolAPI.updateProfile(schoolData._id, payload)
      } else {
        await schoolAPI.createProfile({ ...payload, code: `SCH${Date.now()}` })
      }
      queryClient.invalidateQueries({ queryKey: ['school-profile'] })
      toast.success('School profile saved successfully')
    } catch (error) {
      toast.error(handleError(error) || 'Failed to save school profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>

      <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-3xl font-semibold text-gray-700">School Profile</h2>

        <div className="mt-4 grid gap-4">
          <Input label="School Name" value={profileData.name} onChange={(e) => handleFieldChange('name', e.target.value)} labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Input label="Phone" value={profileData.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Input label="Email" value={profileData.email} onChange={(e) => handleFieldChange('email', e.target.value)} labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          </div>
          <Input label="School Registration Number" value={profileData.registrationNumber} onChange={(e) => handleFieldChange('registrationNumber', e.target.value)} labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">School Logo</label>
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-400 hover:border-blue-500 transition"
                onClick={handleLogoClick}
                title="Click to change logo"
              >
                {logoPreview || schoolData?.logo ? (
                  <img
                    src={logoPreview || schoolData?.logo}
                    alt="School Logo"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[10px] text-gray-500 text-center px-1">Click to upload</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogoClick}
                disabled={logoUploading}
                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
              >
                {logoUploading ? 'Uploading...' : 'Change Logo'}
              </button>
              <input
                type="file"
                ref={logoFileRef}
                onChange={handleLogoChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

        <div className="mt-4">
          <label className="mb-1 block text-lg font-medium text-gray-900">Address</label>
          <textarea
            rows="3"
            value={profileData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full rounded-lg border-2 border-transparent bg-gray-200/70 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-100 p-5">
          <h2 className="text-center text-2xl font-semibold text-gray-900">School Academic</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* <Select
              label="Academic Session"
              placeholder="Select"
              options={[
                { label: '2023 - 2024', value: '2023-2024' },
                { label: '2024 - 2025', value: '2024-2025' },
              ]}
              className="bg-gray-200/70"
            /> */}
            <Input label="Academic Session" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Select
              label="Grading System"
              placeholder="Select"
              labelClassName="text-lg"
              options={[
                { label: 'A-F', value: 'af' },
                { label: 'GPA', value: 'gpa' },
              ]}
              className="bg-gray-200/70"
            />
            <Input label="Passing Marks" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
            <Select
              label="Exam Type"
              labelClassName="text-lg"
              placeholder="Select"
              options={[
                { label: 'Mid Term', value: 'mid' },
                { label: 'Final', value: 'final' },
              ]}
              className="bg-gray-200/70 "
            />
          </div>
        </div>

        <div className="rounded-2xl bg-gray-100 p-5">
          <h2 className="text-center text-2xl font-semibold text-gray-700">Notifications</h2>
          <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-2 ">

            <Toggle label="Email Notification" />
            <Toggle label="SMS Alerts" />
            <Toggle label="Reminder Days" />

            {/* <Input label="Reminder Days" className="bg-gray-200/70 border-transparent" /> */}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">Fees & Finance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Select
            label="Currency"
            placeholder="Select"
            labelClassName="text-lg"
            options={[
              { label: 'USD', value: 'usd' },
              { label: 'PKR', value: 'pkr' },
              { label: 'EUR', value: 'eur' },
            ]}
            className="bg-gray-200/70"
          />
          <Select
            label="Late Fee Fine"
            placeholder="Select"
            labelClassName="text-lg"
            options={[
              { label: 'USD', value: 'usd' },
              { label: 'PKR', value: 'pkr' },
              { label: 'EUR', value: 'eur' },
            ]}
            className="bg-gray-200/70"
          />
          <Input label="Late Fee Fine" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Receipt Prefix" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          <Input label="Allow Partial Payments" placeholder="" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
      </div>


       <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">User Security</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        
          
          <Input label="Password Policy" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Session Timeout" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Enable Two-Factor Authentication" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Login Attempts Limit" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          
      </div>

      
       <div className="rounded-2xl bg-gray-100 p-5">
        <h2 className="text-center text-2xl font-semibold text-gray-700">System</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
        
          
          <Input label="Date Format" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Time zone" placeholder="FEE-02-26" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Language" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
          <Input label="Theme" placeholder="Select" labelClassName="text-lg" className="bg-gray-200/70 border-transparent" />
        </div>
          
      </div>

      <div className='flex items-center justify-end gap-3 '>
        <Button variant='outline' className=" px-6 py-2 rounded border border-gray-900" onClick={() => setProfileData({ name: schoolData?.name || '', phone: schoolData?.phone || '', email: schoolData?.email || '', registrationNumber: schoolData?.registrationNumber || '', address: schoolData?.address || '' })}>Cancel</Button>
        <Button variant='primary' className=" px-6 py-2 rounded " loading={isSubmitting} onClick={handleSave}>Save</Button>
      </div>

    </div>
  )
}

export default SchoolProfile

