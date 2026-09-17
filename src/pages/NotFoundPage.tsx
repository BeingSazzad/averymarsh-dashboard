import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#171A1F]">Page not found</h1>
        <p className="text-sm text-[#68707C] mt-1">This admin route does not exist.</p>
        <Link to={ROUTES.overview}>
          <Button className="mt-4">Back to overview</Button>
        </Link>
      </div>
    </div>
  )
}
