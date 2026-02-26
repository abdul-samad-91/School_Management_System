import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import logo from '@/Assets/logo.svg'

const AuthLayout = () => {
  const year = new Date().getFullYear()
  const { token } = useAuthStore()
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className='grid grid-cols-[30%_70%]'>
      <div >
        <img src="./src/Assets/loginSignup.png" alt="Login/Signup" className="w-full h-full object-cover" />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-[#8095ea]  to-[#587de3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          
   <div className="flex  gap-4 ">
     {/* <img
    src={logo}
    alt="Logo"
    
  /> */}
  <h1 className="text-4xl font-bold text-white">
    SMS
  </h1>
   </div>

          <div>
            <h2 className='text-3xl font-bold'>
              {isRegisterPage ? 'Welcome to' : 'Welcome Back'}
            </h2>
            {isRegisterPage && (
              <h2 className='text-3xl font-bold'>School Management System</h2>
            )}
          </div>
          <div>
            <p className="text-primary-100 mb-20">
            Manage your school efficiently and effectively
          </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>
        
        <p className="text-center text-primary-100 text-sm mt-6">
          © {year} School Management System. All rights reserved.
        </p>
      </div>
    </div>
    </div>
  )
}

export default AuthLayout

