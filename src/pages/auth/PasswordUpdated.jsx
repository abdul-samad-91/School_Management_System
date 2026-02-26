import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

const PasswordUpdated = () => {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
        <span className="text-white text-lg">✓</span>
      </div>

      <h2 className="mt-3 text-base font-semibold text-gray-900">Success</h2>
      <p className="mt-1 text-xs text-gray-500">Your Password Reset Successfully</p>

      <div className="mt-4">
        <Link to="/login">
          <Button type="button" className="w-full">
            Back to Log in
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PasswordUpdated
