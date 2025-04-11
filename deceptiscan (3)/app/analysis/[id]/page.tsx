import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"
import AnalysisResults from "@/components/analysis-results"
import { getMockAnalysisData } from "@/lib/mock-data"

export default function AnalysisPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the analysis results from an API
  // For now, we'll use mock data
  const analysisData = getMockAnalysisData(params.id)

  if (!analysisData) {
    return notFound()
  }

  return (
    <main className="container max-w-6xl px-4 py-8">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto" />}>
        <AnalysisResults analysisData={analysisData} />
      </Suspense>
    </main>
  )
}
