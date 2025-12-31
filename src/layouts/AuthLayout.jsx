import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const AuthLayout = () => {
  const { token } = useAuthStore()

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            School Management System
          </h1>
          <p className="text-primary-100">
            Manage your school efficiently and effectively
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>
        
        <p className="text-center text-primary-100 text-sm mt-6">
          © 2024 School Management System. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout

