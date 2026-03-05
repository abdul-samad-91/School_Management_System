import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { handleError } from '@/lib/utils'
import { Eye, EyeOff, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await authAPI.login(data)
      
      if (response.data.success) {
        setAuth(response.data.data, response.data.token)
        toast.success('Login successful!')
        navigate('/')
      }
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div >
      <div className=" mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
        <p className="text-primary-500 mt-1">Please Enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          // placeholder="Enter your username"
          labelClassName="mb-2"
          error={errors.username?.message}
          rightIcon={<Mail className="h-4 w-4 text-gray-900" />}
          {...register('username', { required: 'Username is required' })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          // placeholder="Enter your password"
          labelClassName="mb-2"
          error={errors.password?.message}
          rightIcon={showPassword ? <EyeOff className="h-4 w-4 text-gray-700" /> : <Eye className="h-4 w-4 text-gray-700" />}
          rightIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
          onRightIconClick={() => setShowPassword((prev) => !prev)}
          {...register('password', { required: 'Password is required' })}
        />
<div className='flex items-center justify-between'>
  
        <div className="flex ">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('rememberMe')}
            />
            Remember me
          </label>
        </div>

        <div className="text-right">
          <Link to="/forgot-password" className="text-base text-red-600 hover:text-red-700">
            Forgot password?
          </Link>
        </div>
</div>

        <Button
          type="submit"
          className="w-full "
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-base text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-normal">
            Create Account
          </Link>
        </p>
      </div>

      {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">Default Credentials:</p>
        <p className="text-xs text-blue-700">Username: <strong>superadmin</strong></p>
        <p className="text-xs text-blue-700">Password: <strong>Admin@123</strong></p>
        <p className="text-xs text-blue-600 mt-2">⚠️ Please change the password after first login</p>
      </div> */}
    </div>
  )
}

export default Login

