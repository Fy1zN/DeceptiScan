"use client"

import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RatingComparisonProps {
  originalRating: number
  realRating: number
}

export default function RatingComparison({ originalRating, realRating }: RatingComparisonProps) {
  const ratingDifference = originalRating - realRating
  const isInflated = ratingDifference > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Original Rating</p>
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`original-${i}`}
                  className={`h-6 w-6 ${
                    i < Math.floor(originalRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : i < originalRating
                        ? "text-yellow-500 fill-yellow-500 opacity-50"
                        : "text-muted stroke-1"
                  }`}
                />
              ))}
            </div>
            <p className="text-2xl font-bold">{originalRating.toFixed(1)}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Real Rating</p>
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`real-${i}`}
                  className={`h-6 w-6 ${
                    i < Math.floor(realRating)
                      ? "text-green-500 fill-green-500"
                      : i < realRating
                        ? "text-green-500 fill-green-500 opacity-50"
                        : "text-muted stroke-1"
                  }`}
                />
              ))}
            </div>
            <p className="text-2xl font-bold">{realRating.toFixed(1)}</p>
          </div>
        </Card>
      </div>

      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm font-medium flex items-center justify-center">
          {isInflated ? (
            <>
              <span className="text-destructive mr-1">↓</span>
              Rating inflated by {ratingDifference.toFixed(1)} stars due to fake reviews
            </>
          ) : (
            <>
              <span className="text-green-500 mr-1">↑</span>
              Rating is accurate and reflects genuine customer experiences
            </>
          )}
        </p>
      </div>
    </div>
  )
}
