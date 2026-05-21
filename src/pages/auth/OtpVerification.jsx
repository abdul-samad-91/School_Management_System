import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import { authAPI } from '@/lib/api'

const OtpVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const email = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('email') || 'xyz@example.com'
  }, [location.search])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }
    try {
      setLoading(true)
      await authAPI.verifyOtp({ email, otp: code })
      toast.success('Verification successful!')
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${code}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-10 w-10 rounded-md border border-gray-200 text-center text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
          />
        ))}
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-red-500">Otp will expire in 09:59</p>
      </div>

      <div className="mt-4">
        <Button type="button" className="w-full" loading={loading} onClick={handleVerify}>
          Verify My Account
        </Button>
      </div>
    </div>
  )
}

export default OtpVerification
