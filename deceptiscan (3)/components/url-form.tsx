"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export default function UrlForm() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url) {
      setError("Please enter a product URL")
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (err) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)

    // In a real app, we would send the URL to an API for processing
    // For now, we'll simulate a delay and redirect to a mock analysis page
    setTimeout(() => {
      // Generate a random ID for the analysis
      const analysisId = Math.random().toString(36).substring(2, 10)
      router.push(`/analysis/${analysisId}`)
    }, 2000)
  }

  return (
    <div id="url-form">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyze Product Reviews</CardTitle>
          <CardDescription>Enter a product URL to analyze its reviews and get a real rating</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="https://www.example.com/product/123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Reviews"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
