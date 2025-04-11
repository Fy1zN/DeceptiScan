"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { AnalysisData } from "@/lib/mock-data"
import RatingComparison from "@/components/rating-comparison"
import ReviewList from "@/components/review-list"
import ModuleResults from "@/components/module-results"

export default function AnalysisResults({ analysisData }: { analysisData: AnalysisData }) {
  const [activeTab, setActiveTab] = useState("overview")

  const fakePercentage = (analysisData.fakeReviews / analysisData.totalReviews) * 100
  const genuinePercentage = 100 - fakePercentage

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Badge variant={fakePercentage > 30 ? "destructive" : "default"}>Analysis ID: {analysisData.id}</Badge>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{analysisData.productName}</h1>
        <p className="text-muted-foreground break-all">{analysisData.url}</p>
      </div>

      <Alert className={fakePercentage > 30 ? "border-destructive" : "border-green-500"}>
        {fakePercentage > 30 ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        <AlertTitle>{fakePercentage > 30 ? "High number of fake reviews detected!" : "Analysis complete"}</AlertTitle>
        <AlertDescription>
          {fakePercentage > 30
            ? `We found that ${fakePercentage.toFixed(1)}% of reviews for this product may be fake.`
            : `We found that ${genuinePercentage.toFixed(1)}% of reviews for this product appear to be genuine.`}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="modules">ML Modules</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Comparison</CardTitle>
                <CardDescription>Original vs. Real Rating (after removing fake reviews)</CardDescription>
              </CardHeader>
              <CardContent>
                <RatingComparison originalRating={analysisData.originalRating} realRating={analysisData.realRating} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Authenticity</CardTitle>
                <CardDescription>Breakdown of genuine vs. fake reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Genuine Reviews</span>
                    <span className="font-medium">{genuinePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={genuinePercentage} className="h-2 bg-muted" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fake Reviews</span>
                    <span className="font-medium">{fakePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={fakePercentage} className="h-2 bg-muted" />
                </div>

                <div className="pt-4 flex justify-between text-sm border-t">
                  <span>Total Reviews Analyzed</span>
                  <span className="font-medium">{analysisData.totalReviews}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>Key findings from our AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisData.modules.map((module) => (
                  <div key={module.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{module.name}</h3>
                      <Badge variant={module.score > 75 ? "destructive" : "outline"}>{module.score}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{module.insights[0]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewList reviews={analysisData.reviews} />
        </TabsContent>

        <TabsContent value="modules">
          <ModuleResults modules={analysisData.modules} />
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Detailed analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Review Quality</h3>
                <p>
                  {fakePercentage > 30
                    ? "This product has a concerning number of fake reviews that artificially inflate its rating."
                    : "This product has mostly genuine reviews that accurately reflect customer experiences."}
                </p>
                <Alert>
                  <AlertTitle>Real Rating: {analysisData.realRating} / 5</AlertTitle>
                  <AlertDescription>
                    After filtering out fake reviews, the product's actual rating is {analysisData.realRating} compared
                    to the original {analysisData.originalRating}.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Common Patterns in Fake Reviews</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Excessive use of superlatives and generic praise</li>
                  <li>Lack of specific details about product usage</li>
                  <li>Reviews from new accounts with limited history</li>
                  <li>Similar or duplicate content across multiple reviews</li>
                  <li>Extreme ratings (1 or 5 stars) without substantive feedback</li>
                </ul>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Focus on reviews with verified purchases</li>
                  <li>Look for detailed reviews that mention specific use cases</li>
                  <li>Consider reviews that mention both pros and cons</li>
                  <li>Pay attention to reviews with photos or videos of the product in use</li>
                  <li>Check for reviews from established accounts with review history</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
