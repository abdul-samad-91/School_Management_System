import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

const VerifyEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const email = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('email') || 'xyz@example.com'
  }, [location.search])

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900">Verify your Email</h2>
        <p className="text-xs text-gray-500 mt-1">
          We have sent a link to your email {email}. Please follow
          the link inside to continue.
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn&apos;t receive an email?{' '}
          <button type="button" className="text-primary-600 hover:text-primary-700">
            Resend Link
          </button>
        </p>
      </div>

      <div className="mt-4">
        <Button type="button" className="w-full" onClick={() => navigate('/login')}>
          Skip Now
        </Button>
      </div>
    </div>
  )
}

export default VerifyEmail
