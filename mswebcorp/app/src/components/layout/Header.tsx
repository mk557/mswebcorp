import Link from 'next/link'
import { MountainIcon } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center bg-transparent">
      <Link className="flex items-center justify-center" href="#">
        <MountainIcon className="h-6 w-6 text-white" />
        <span className="sr-only">mswebcorp</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium text-white hover:text-gray-300 transition-colors" href="#services">
          Services
        </Link>
        <Link className="text-sm font-medium text-white hover:text-gray-300 transition-colors" href="#portfolio">
          Portfolio
        </Link>
        <Link className="text-sm font-medium text-white hover:text-gray-300 transition-colors" href="#testimonials">
          Testimonials
        </Link>
        <Link className="text-sm font-medium text-white hover:text-gray-300 transition-colors" href="#contact">
          Contact
        </Link>
      </nav>
    </header>
  )
}

export default Header