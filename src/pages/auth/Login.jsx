import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { handleError } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

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
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register('username', { required: 'Username is required' })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">Default Credentials:</p>
        <p className="text-xs text-blue-700">Username: <strong>superadmin</strong></p>
        <p className="text-xs text-blue-700">Password: <strong>Admin@123</strong></p>
        <p className="text-xs text-blue-600 mt-2">⚠️ Please change the password after first login</p>
      </div>
    </div>
  )
}

export default Login

