import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      // UI-only placeholder for now
      toast.success('Password reset instructions sent!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Forgot Password?</h2>
        <p className="text-xs text-gray-500 mt-1">
          If you forgot your password, we will email you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/login" className="text-xs text-primary-600 hover:text-primary-700">
          Return to Log in
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
