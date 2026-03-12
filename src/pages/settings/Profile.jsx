import { useEffect, useRef, useState } from 'react'
import { User, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import UserLogo from '@/assets/AddUserMale.svg'

const createFormState = (user) => {
  const firstName = user?.profile?.firstName || ''
  const lastName = user?.profile?.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()

  return {
    fullName,
    role: user?.role || 'admin',
    email: user?.email || '',
    phoneNumber: user?.profile?.phone || '',
    username: user?.username || '',
    password: '',
    confirmPassword: '',
    lastLogin: user?.lastLogin
      ? new Date(user.lastLogin).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
  }
}

const Profile = () => {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState(createFormState(user))
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setFormData(createFormState(user))
  }, [user])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setUserPhotoUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev)
      }
      return previewUrl
    })
  }

  useEffect(() => {
    return () => {
      if (userPhotoUrl) {
        URL.revokeObjectURL(userPhotoUrl)
      }
    }
  }, [userPhotoUrl])

  const handleCancel = () => {
    setFormData(createFormState(user))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Password and confirm password must match')
      return
    }

    toast.success('Profile form saved')
  }

  const inputStyles =
    'w-full rounded-xl border-2 border-gray-300 bg-gray-100 px-3 py-2.5 text-base text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
  const labelStyles = 'text-lg font-semibold uppercase tracking-wide text-slate-600'

  return (
    <div className="h-full space-y-4 overflow-y-auto pt-5">
      <div className="rounded-2xl px-5 py-4 ">
        <h1 className="text-3xl font-semibold text-slate-900">Admin Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_14px_30px_-16px_rgba(15,23,42,0.35)]"
      >
        {/* <div className="mb-5 flex justify-center">
          <button
            type="button"
            className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-slate-200 to-slate-300 text-slate-600 shadow-lg"
          >
            <User className="h-12 w-12" />
            <span className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-blue-600 p-1.5 text-white shadow">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </button>
        </div> */}


<div className="mb-5 flex justify-center">
   <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
                  
             <img
        src={userPhotoUrl || UserLogo}
        alt="Upload Logo"
        className="w-24 h-24 cursor-pointer rounded-full border object-cover"
        onClick={handlePhotoClick}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        className="hidden"
        accept="image/*"
      />
                </div>
</div>



        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className={labelStyles}>Full Name</span>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleFieldChange}
              placeholder="Type Here"
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleFieldChange}
              className={`${inputStyles} capitalize`}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              placeholder="Type Here"
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Phone Number</span>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleFieldChange}
              placeholder="Type Here"
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Username</span>
            <input
              name="username"
              value={formData.username}
              onChange={handleFieldChange}
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFieldChange}
              placeholder="Type Here"
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleFieldChange}
              className={inputStyles}
            />
          </label>

          <label className="space-y-1">
            <span className={labelStyles}>Last Login</span>
            <input
              name="lastLogin"
              value={formData.lastLogin}
              onChange={handleFieldChange}
              placeholder="No login record"
              className={inputStyles}
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
