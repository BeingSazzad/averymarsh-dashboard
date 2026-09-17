import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { Button } from '../components/ui/Button'
import { LatticeLogo } from '../components/shared/LatticeLogo'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F2F2F7]">
      <div className="text-center flex flex-col items-center gap-4">
        <LatticeLogo />
        <div>
          <h1 className="text-xl font-bold text-[#171A1F]">Page not found</h1>
          <p className="text-sm text-[#68707C] mt-1">This admin route does not exist.</p>
        </div>
        <Link to={ROUTES.overview}>
          <Button>Back to overview</Button>
        </Link>
      </div>
    </div>
  )
}
