import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative w-full bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="container px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          <span className="text-primary">DeceptiScan</span> — AI-Powered Fake Review Detector
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-8 text-muted-foreground">
          Detect fake product reviews in real-time and get accurate "Real Ratings" based only on authentic reviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" asChild>
            <Link href="#url-form">Try It Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
        <div className="animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
