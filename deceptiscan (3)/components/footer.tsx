import Link from "next/link"
import { Microscope } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/40">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Microscope className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">DeceptiScan</span>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="#features" className="text-sm hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm hover:underline">
              How It Works
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DeceptiScan. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
