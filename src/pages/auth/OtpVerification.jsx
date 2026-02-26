import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/ui/Button'

const OtpVerification = () => {
  const location = useLocation()

  const email = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('email') || 'xyz@example.com'
  }, [location.search])

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Login with your Email Address</h2>
        <p className="text-xs text-gray-500 mt-1">
          We sent a verification code to your email {email}. Enter the code from the email in the field below.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="h-10 w-10 rounded-md border border-gray-200 text-center text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          />
        ))}
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-red-500">Otp will expire in 09:59</p>
      </div>

      <div className="mt-4">
        <Button type="button" className="w-full">
          Verify My Account
        </Button>
      </div>
    </div>
  )
}

export default OtpVerification
