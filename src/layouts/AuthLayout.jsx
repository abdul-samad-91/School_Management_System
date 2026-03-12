import { useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import logo from '@/assets/logo.svg'
import BookLogo1 from '@/assets/BookLogo1.png'

const AuthLayout = () => {
  const year = new Date().getFullYear()
  const { token } = useAuthStore()
  const location = useLocation()
  const isRegisterPage = location.pathname === '/register'

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className='grid min-h-screen grid-cols-[30%_70%]'>
      <div >
        <img src="./src/Assets/loginSignup.png" alt="Login/Signup" className="w-full h-full object-cover" />
      </div>
      <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-[#ffff] to-[#506EE4] flex items-center justify-center p-4 ">
      <div className="w-full max-w-lg  ">
        <div className="text-center flex flex-col items-center justify-center gap-4 mb-10 ">
          <div className="flex items-center justify-center gap-3">
            <img
              src={BookLogo1}
              alt="Logo"
              className="h-20 w-20 object-contain"
            />
            <h1 className="text-5xl font-bold text-black font-serif">SMS</h1>
          </div>

          <div>
            <h2 className='text-4xl font-bold mb-2'>
              {isRegisterPage ? 'Welcome to' : 'Welcome Back'}
            </h2>
            {isRegisterPage && (
              <h2 className='text-4xl font-bold '>School Management System</h2>
            )}
          </div>
          <div>
            <p className="text-black text-lg mb-6">
            {isRegisterPage ? '' : 'Manage your school efficiently and effectively'}
          </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>
        
       <div className=' mt-32'>
         <p className="text-center text-primary-100 text-base ">
          © {year} School Management System. All rights reserved.
        </p>
       </div>
      </div>
    </div>
    </div>
  )
}

export default AuthLayout

