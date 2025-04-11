import { Suspense } from "react"
import UrlForm from "@/components/url-form"
import { Loader2 } from "lucide-react"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <div className="container max-w-4xl px-4 py-8">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
          <UrlForm />
        </Suspense>
      </div>
    </main>
  )
}
