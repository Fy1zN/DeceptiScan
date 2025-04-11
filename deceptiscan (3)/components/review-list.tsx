"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, AlertCircle, CheckCircle } from "lucide-react"
import type { Review } from "@/lib/mock-data"

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [filter, setFilter] = useState<"all" | "genuine" | "fake">("all")

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    if (filter === "genuine") return !review.isFake
    if (filter === "fake") return review.isFake
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Reviews</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary text-primary-foreground" : ""}
          >
            All ({reviews.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("genuine")}
            className={filter === "genuine" ? "bg-green-500 text-white border-green-500" : ""}
          >
            Genuine ({reviews.filter((r) => !r.isFake).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("fake")}
            className={filter === "fake" ? "bg-destructive text-destructive-foreground" : ""}
          >
            Fake ({reviews.filter((r) => r.isFake).length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No reviews match the selected filter.</p>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`${review.id}-star-${i}`}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-1"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  {review.isFake ? (
                    <Badge variant="destructive" className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Fake Review
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-500 text-white border-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Genuine Review
                    </Badge>
                  )}
                </div>

                <p className="text-sm">{review.text}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Posted on {new Date(review.date).toLocaleDateString()}</span>
                  {review.isFake && (
                    <span className="text-destructive">Fake score: {(review.fakeScore * 100).toFixed(0)}%</span>
                  )}
                </div>

                {review.isFake && review.fakeReasons.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-destructive mb-1">Reasons flagged as fake:</p>
                    <div className="flex flex-wrap gap-1">
                      {review.fakeReasons.map((reason, index) => (
                        <Badge key={`${review.id}-reason-${index}`} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
