from flask import Flask, render_template, request, redirect, url_for
import uuid
from datetime import datetime
import random
import os
from models.stylometry import StyleAnalyzer
from models.sentiment import SentimentAnalyzer
from models.gan_detector import GANDetector
from models.cross_platform import CrossPlatformMatcher
from models.reviewer_behavior import ReviewerAnalyzer
from models.network_graph import NetworkGraphDetector

app = Flask(__name__)

# Mock database for storing analysis results
analysis_db = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if request.method == 'POST':
        product_url = request.form.get('product_url')
        
        # In a real application, we would scrape the product page and reviews here
        # For demo purposes, we'll use our mock data and analysis
        
        # Generate unique ID for this analysis
        analysis_id = uuid.uuid4().hex[:8]
        
        # Perform analysis using our ML models
        result = perform_analysis(product_url, analysis_id)
        
        # Store result in our mock database
        analysis_db[analysis_id] = result
        
        # Redirect to the analysis results page
        return redirect(url_for('analysis_results', id=analysis_id))

@app.route('/analysis/<id>')
def analysis_results(id):
    # Get analysis from our mock database
    analysis = analysis_db.get(id)
    
    # If no analysis found, we could redirect to home or show an error
    if not analysis:
        # For demo, we'll generate mock data on the fly
        analysis = generate_mock_analysis(id)
        analysis_db[id] = analysis
    
    return render_template('analysis.html', analysis=analysis)

def perform_analysis(product_url, analysis_id):
    # In a real application, this function would:
    # 1. Scrape the product reviews from the URL
    # 2. Run the reviews through our ML models
    # 3. Aggregate results and calculate scores
    
    # For now, we'll generate mock data
    return generate_mock_analysis(analysis_id, product_url)

def generate_mock_analysis(analysis_id, product_url="https://www.example.com/product/123"):
    # Create mock review data
    mock_reviews = [
        {
            "id": "r1",
            "text": "This product is absolutely amazing! I've been using it for a week and it has completely changed my life. I would recommend it to everyone!",
            "rating": 5,
            "author": "JohnDoe123",
            "date": "2023-12-15",
            "verified": True,
            "is_fake": False,
            "fake_score": 0.12,
            "fake_reasons": [],
        },
        {
            "id": "r2",
            "text": "I cannot believe how incredible this product is. It's the best purchase I've ever made. Everyone needs to buy this right now!",
            "rating": 5,
            "author": "ReviewMaster42",
            "date": "2023-12-10",
            "verified": False,
            "is_fake": True,
            "fake_score": 0.86,
            "fake_reasons": ["Excessive enthusiasm", "Generic praise", "No specific details"],
        },
        {
            "id": "r3",
            "text": "The product works well for what I need. Battery life is good and the build quality is decent. Would have given 5 stars but the app is a bit buggy.",
            "rating": 4,
            "author": "TechUser2022",
            "date": "2023-11-28",
            "verified": True,
            "is_fake": False,
            "fake_score": 0.08,
            "fake_reasons": [],
        },
        {
            "id": "r4",
            "text": "Absolutely terrible product. Broke after one day. Don't waste your money!",
            "rating": 1,
            "author": "AngryCustomer99",
            "date": "2023-12-05",
            "verified": False,
            "is_fake": True,
            "fake_score": 0.79,
            "fake_reasons": ["Extreme negativity", "No specific details", "New account"],
        },
        {
            "id": "r5",
            "text": "I've been using this product for about a month now. It has some pros and cons. The interface is intuitive and the performance is good, but I've noticed it gets hot when used for extended periods. Overall satisfied with the purchase.",
            "rating": 4,
            "author": "RealisticReviewer",
            "date": "2023-11-15",
            "verified": True,
            "is_fake": False,
            "fake_score": 0.05,
            "fake_reasons": [],
        },
        {
            "id": "r6",
            "text": "This product is amazing! I've been using it for a week and it has completely changed my life. I would recommend it to everyone!",
            "rating": 5,
            "author": "SuspiciousUser123",
            "date": "2023-12-14",
            "verified": False,
            "is_fake": True,
            "fake_score": 0.92,
            "fake_reasons": ["Duplicate content", "Similar to other reviews", "New account"],
        },
        {
            "id": "r7",
            "text": "Not worth the money. There are better alternatives available for less.",
            "rating": 2,
            "author": "ValueSeeker",
            "date": "2023-10-30",
            "verified": True,
            "is_fake": False,
            "fake_score": 0.15,
            "fake_reasons": [],
        },
        {
            "id": "r8",
            "text": "I bought this product yesterday and I'm already in love with it! It's perfect in every way and worth every penny! Life-changing purchase!",
            "rating": 5,
            "author": "NewAccount2023",
            "date": "2023-12-12",
            "verified": False,
            "is_fake": True,
            "fake_score": 0.88,
            "fake_reasons": ["Excessive enthusiasm", "New account", "No specific details"],
        },
    ]
    
    # Create mock module data
    mock_modules = [
        {
            "name": "Language Stylometry",
            "description": "Detects unnatural and robotic writing styles",
            "score": 78,
            "flagged_reviews": ["r2", "r6", "r8"],
            "insights": [
                "3 reviews showed patterns consistent with AI-generated text",
                "Excessive use of superlatives detected in multiple reviews",
                "Lack of specific product details in flagged reviews",
            ],
        },
        {
            "name": "Sentiment & Emotion Analysis",
            "description": "Identifies reviews lacking genuine sentiment or emotional tone",
            "score": 82,
            "flagged_reviews": ["r2", "r4", "r8"],
            "insights": [
                "Extreme sentiment without supporting details detected",
                "Emotional language patterns inconsistent with genuine reviews",
                "Lack of nuanced emotional expression in flagged reviews",
            ],
        },
        {
            "name": "GAN-Based Text Detection",
            "description": "Detects AI-generated review content",
            "score": 91,
            "flagged_reviews": ["r2", "r6", "r8"],
            "insights": [
                "High probability of AI generation in 3 reviews",
                "Text patterns match known AI writing styles",
                "Lack of human linguistic variations in flagged content",
            ],
        },
        {
            "name": "Cross-Platform Review Matching",
            "description": "Spots duplicated reviews across other e-commerce sites",
            "score": 65,
            "flagged_reviews": ["r6"],
            "insights": [
                "1 review found duplicated across multiple platforms",
                "Similar review patterns detected on competitor products",
                "Review text shows minimal customization between platforms",
            ],
        },
        {
            "name": "Reviewer Behavior Analysis",
            "description": "Detects suspicious users and spam-bots",
            "score": 87,
            "flagged_reviews": ["r2", "r4", "r6", "r8"],
            "insights": [
                "4 reviewers show suspicious activity patterns",
                "Multiple 5-star reviews from new accounts detected",
                "Unusual reviewing frequency detected in flagged accounts",
            ],
        },
    ]
    
    # Calculate metrics
    fake_reviews = [r for r in mock_reviews if r["is_fake"]]
    genuine_reviews = [r for r in mock_reviews if not r["is_fake"]]
    
    # Calculate ratings
    all_ratings = [r["rating"] for r in mock_reviews]
    genuine_ratings = [r["rating"] for r in genuine_reviews]
    
    original_rating = sum(all_ratings) / len(all_ratings) if all_ratings else 0
    real_rating = sum(genuine_ratings) / len(genuine_ratings) if genuine_ratings else 0
    
    fake_percentage = (len(fake_reviews) / len(mock_reviews)) * 100 if mock_reviews else 0
    
    # Create the analysis result
    analysis = {
        "id": analysis_id,
        "url": product_url,
        "product_name": "Smart Home Assistant Pro",
        "original_rating": round(original_rating, 1),
        "real_rating": round(real_rating, 1),
        "total_reviews": len(mock_reviews),
        "fake_reviews": len(fake_reviews),
        "fake_percentage": fake_percentage,
        "reviews": mock_reviews,
        "modules": mock_modules,
        "analysis_date": datetime.now().isoformat(),
    }
    
    return analysis

if __name__ == '__main__':
    # Create model directories if they don't exist
    os.makedirs('models', exist_ok=True)
    app.run(debug=True)
