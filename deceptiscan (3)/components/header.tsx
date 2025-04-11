import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Microscope } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Microscope className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DeceptiScan</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
