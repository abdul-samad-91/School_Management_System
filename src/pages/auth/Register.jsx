import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authAPI } from '@/lib/api'
import { handleError } from '@/lib/utils'
import { Eye, EyeOff, Mail, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onTouched',
  })
  const password = watch('password')

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      toast.error('Please agree to Terms & Privacy')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.register({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      })
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      }
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Register</h2>
        <p className=" mt-2">Please enter your details to sign up</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          // placeholder="Enter your name"
          labelClassName="mb-2"
          error={errors.name?.message}
          rightIcon={<User className="h-4 w-4 text-gray-900" />}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: 50,
              message: 'Name must be 50 characters or less',
            },
            validate: (value) => value.trim().length > 0 || 'Name is required',
          })}
        />

        <Input
          label="Email Address"
          type="email"
          // placeholder="Enter your email"
          labelClassName="mb-2"
          error={errors.email?.message}
          rightIcon={<Mail className="h-4 w-4 text-gray-900" />}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            },
            validate: (value) => value.trim().length > 0 || 'Email is required',
          })}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          // placeholder="Enter your password"
          labelClassName="mb-2"
          error={errors.password?.message}
          rightIcon={showPassword ? <EyeOff className="h-4 w-4 text-gray-900" /> : <Eye className="h-4 w-4 text-gray-900" />}
          rightIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
          onRightIconClick={() => setShowPassword((prev) => !prev)}
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            validate: (value) => {
              const hasUpper = /[A-Z]/.test(value)
              const hasLower = /[a-z]/.test(value)
              const hasNumber = /\d/.test(value)
              if (!hasUpper || !hasLower || !hasNumber) {
                return 'Password must include upper, lower, and number'
              }
              return true
            },
          })}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          // placeholder="Confirm your password"
          labelClassName="mb-2"
          error={errors.confirmPassword?.message}
          rightIcon={showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-900" /> : <Eye className="h-4 w-4 text-gray-900" />}
          rightIconAriaLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
          onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I Agree to{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700">
              Terms & Privacy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '} 
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
