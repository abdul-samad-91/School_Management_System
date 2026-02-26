import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const newPassword = watch('newPassword')

  const onSubmit = async () => {
    try {
      setLoading(true)
      // UI-only placeholder for now
      toast.success('Password updated successfully!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Reset Password?</h2>
        <p className="text-xs text-gray-500 mt-1">
          Enter New Password & Confirm Password to get inside
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Old Password"
          type="password"
          placeholder="Enter your old password"
          error={errors.oldPassword?.message}
          {...register('oldPassword', { required: 'Old password is required' })}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          error={errors.newPassword?.message}
          {...register('newPassword', { required: 'New password is required' })}
        />

        <Input
          label="New Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: value => value === newPassword || 'Passwords do not match',
          })}
        />

        <Button type="submit" className="w-full" loading={loading}>
          Change Password
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

export default ResetPassword
