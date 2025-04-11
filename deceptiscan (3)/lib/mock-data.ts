// This file contains mock data for the DeceptiScan application
// In a real application, this would be replaced with actual API calls to ML models

export interface Review {
  id: string
  text: string
  rating: number
  author: string
  date: string
  verified: boolean
  isFake: boolean
  fakeScore: number
  fakeReasons: string[]
}

export interface AnalysisModule {
  name: string
  description: string
  score: number // 0-100
  flaggedReviews: string[] // IDs of flagged reviews
  insights: string[]
}

export interface AnalysisData {
  id: string
  url: string
  productName: string
  originalRating: number
  realRating: number
  totalReviews: number
  fakeReviews: number
  reviews: Review[]
  modules: AnalysisModule[]
  analysisDate: string
}

const mockReviews: Review[] = [
  {
    id: "r1",
    text: "This product is absolutely amazing! I've been using it for a week and it has completely changed my life. I would recommend it to everyone!",
    rating: 5,
    author: "JohnDoe123",
    date: "2023-12-15",
    verified: true,
    isFake: false,
    fakeScore: 0.12,
    fakeReasons: [],
  },
  {
    id: "r2",
    text: "I cannot believe how incredible this product is. It's the best purchase I've ever made. Everyone needs to buy this right now!",
    rating: 5,
    author: "ReviewMaster42",
    date: "2023-12-10",
    verified: false,
    isFake: true,
    fakeReasons: ["Excessive enthusiasm", "Generic praise", "No specific details"],
  },
  {
    id: "r3",
    text: "The product works well for what I need. Battery life is good and the build quality is decent. Would have given 5 stars but the app is a bit buggy.",
    rating: 4,
    author: "TechUser2022",
    date: "2023-11-28",
    verified: true,
    isFake: false,
    fakeScore: 0.08,
    fakeReasons: [],
  },
  {
    id: "r4",
    text: "Absolutely terrible product. Broke after one day. Don't waste your money!",
    rating: 1,
    author: "AngryCustomer99",
    date: "2023-12-05",
    verified: false,
    isFake: true,
    fakeReasons: ["Extreme negativity", "No specific details", "New account"],
  },
  {
    id: "r5",
    text: "I've been using this product for about a month now. It has some pros and cons. The interface is intuitive and the performance is good, but I've noticed it gets hot when used for extended periods. Overall satisfied with the purchase.",
    rating: 4,
    author: "RealisticReviewer",
    date: "2023-11-15",
    verified: true,
    isFake: false,
    fakeScore: 0.05,
    fakeReasons: [],
  },
  {
    id: "r6",
    text: "This product is amazing! I've been using it for a week and it has completely changed my life. I would recommend it to everyone!",
    rating: 5,
    author: "SuspiciousUser123",
    date: "2023-12-14",
    verified: false,
    isFake: true,
    fakeReasons: ["Duplicate content", "Similar to other reviews", "New account"],
  },
  {
    id: "r7",
    text: "Not worth the money. There are better alternatives available for less.",
    rating: 2,
    author: "ValueSeeker",
    date: "2023-10-30",
    verified: true,
    isFake: false,
    fakeScore: 0.15,
    fakeReasons: [],
  },
  {
    id: "r8",
    text: "I bought this product yesterday and I'm already in love with it! It's perfect in every way and worth every penny! Life-changing purchase!",
    rating: 5,
    author: "NewAccount2023",
    date: "2023-12-12",
    verified: false,
    isFake: true,
    fakeReasons: ["Excessive enthusiasm", "New account", "No specific details"],
  },
]

const mockModules: AnalysisModule[] = [
  {
    name: "Language Stylometry",
    description: "Detects unnatural and robotic writing styles",
    score: 78,
    flaggedReviews: ["r2", "r6", "r8"],
    insights: [
      "3 reviews showed patterns consistent with AI-generated text",
      "Excessive use of superlatives detected in multiple reviews",
      "Lack of specific product details in flagged reviews",
    ],
  },
  {
    name: "Sentiment & Emotion Analysis",
    description: "Identifies reviews lacking genuine sentiment or emotional tone",
    score: 82,
    flaggedReviews: ["r2", "r4", "r8"],
    insights: [
      "Extreme sentiment without supporting details detected",
      "Emotional language patterns inconsistent with genuine reviews",
      "Lack of nuanced emotional expression in flagged reviews",
    ],
  },
  {
    name: "GAN-Based Text Detection",
    description: "Detects AI-generated review content",
    score: 91,
    flaggedReviews: ["r2", "r6", "r8"],
    insights: [
      "High probability of AI generation in 3 reviews",
      "Text patterns match known AI writing styles",
      "Lack of human linguistic variations in flagged content",
    ],
  },
  {
    name: "Cross-Platform Review Matching",
    description: "Spots duplicated reviews across other e-commerce sites",
    score: 65,
    flaggedReviews: ["r6"],
    insights: [
      "1 review found duplicated across multiple platforms",
      "Similar review patterns detected on competitor products",
      "Review text shows minimal customization between platforms",
    ],
  },
  {
    name: "Reviewer Behavior Analysis",
    description: "Detects suspicious users and spam-bots",
    score: 87,
    flaggedReviews: ["r2", "r4", "r6", "r8"],
    insights: [
      "4 reviewers show suspicious activity patterns",
      "Multiple 5-star reviews from new accounts detected",
      "Unusual reviewing frequency detected in flagged accounts",
    ],
  },
]

export function getMockAnalysisData(id: string): AnalysisData {
  // In a real app, we would fetch this data from an API
  // For now, we'll return mock data

  const fakeReviews = mockReviews.filter((review) => review.isFake)
  const genuineReviews = mockReviews.filter((review) => !review.isFake)

  // Calculate real rating based only on genuine reviews
  const totalGenuineRating = genuineReviews.reduce((sum, review) => sum + review.rating, 0)
  const realRating = genuineReviews.length > 0 ? totalGenuineRating / genuineReviews.length : 0

  // Calculate original rating based on all reviews
  const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0)
  const originalRating = mockReviews.length > 0 ? totalRating / mockReviews.length : 0

  return {
    id,
    url: "https://www.example.com/product/123",
    productName: "Smart Home Assistant Pro",
    originalRating: Number.parseFloat(originalRating.toFixed(1)),
    realRating: Number.parseFloat(realRating.toFixed(1)),
    totalReviews: mockReviews.length,
    fakeReviews: fakeReviews.length,
    reviews: mockReviews,
    modules: mockModules,
    analysisDate: new Date().toISOString(),
  }
}
