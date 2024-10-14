import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 bg-white border-t border-black">
      <p className="text-xs text-gray-500">© 2024 mswebcorp. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs text-black hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs text-black hover:underline underline-offset-4" href="#">
          Privacy
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link href="#" className="text-gray-500 hover:text-black">
          <Facebook className="h-5 w-5" />
          <span className="sr-only">Facebook</span>
        </Link>
        <Link href="#" className="text-gray-500 hover:text-black">
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Twitter</span>
        </Link>
        <Link href="#" className="text-gray-500 hover:text-black">
          <Instagram className="h-5 w-5" />
          <span className="sr-only">Instagram</span>
        </Link>
        <Link href="#" className="text-gray-500 hover:text-black">
          <Linkedin className="h-5 w-5" />
          <span className="sr-only">LinkedIn</span>
        </Link>
      </div>
    </footer>
  )
}

export default Footer