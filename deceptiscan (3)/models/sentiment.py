import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

class SentimentAnalyzer:
    """
    Sentiment & Emotion Analysis module to detect reviews with unnatural sentiment patterns
    """
    
    def __init__(self, model_path="models/sentiment_model.pkl"):
        self.model_path = model_path
        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.model = None
        
        # Load model if it exists, otherwise create a new one
        if os.path.exists(model_path):
            try:
                self.load_model()
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = RandomForestClassifier()
        else:
            self.model = RandomForestClassifier()
            
        # Emotion words for basic emotion detection
        self.emotion_lexicon = {
            'joy': ['happy', 'joy', 'delighted', 'pleased', 'glad', 'thrilled', 'excited'],
            'sadness': ['sad', 'unhappy', 'disappointed', 'depressed', 'miserable', 'heartbroken'],
            'anger': ['angry', 'furious', 'annoyed', 'irritated', 'frustrated'],
            'fear': ['afraid', 'scared', 'frightened', 'terrified', 'worried'],
            'surprise': ['surprised', 'shocked', 'amazed', 'astonished'],
            'disgust': ['disgusted', 'repulsed', 'revolted', 'dislike'],
        }
    
    def train(self, texts, labels):
        """
        Train the sentiment analyzer
        
        Args:
            texts (list): List of review texts
            labels (list): Binary labels (1 for fake, 0 for genuine)
        """
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        
        # Save the model
        self.save_model()
    
    def analyze_review(self, text, rating=None):
        """
        Analyze a single review text for sentiment patterns
        
        Args:
            text (str): The review text to analyze
            rating (int, optional): The star rating associated with the review
            
        Returns:
            dict: Analysis result with prediction and confidence score
        """
        # Extract basic sentiment and emotion features
        sentiment_features = self._extract_sentiment_features(text)
        
        # Check for sentiment-rating mismatch
        sentiment_score = sentiment_features['sentiment_score']
        has_mismatch = False
        mismatch_severity = 0
        
        if rating is not None:
            # High rating but negative sentiment
            if rating >= 4 and sentiment_score < -0.3:
                has_mismatch = True
                mismatch_severity = abs(sentiment_score + (rating / 5))
            # Low rating but positive sentiment
            elif rating <= 2 and sentiment_score > 0.3:
                has_mismatch = True
                mismatch_severity = abs(sentiment_score - (rating / 5))
        
        # For demo purposes, let's create a simple fake detection heuristic
        fake_score = 0.0
        
        # Reviews with extreme sentiment are more likely to be fake
        if abs(sentiment_score) > 0.7:
            fake_score += 0.3
            
        # Reviews with very few emotions expressed might be fake
        if sentiment_features['emotion_count'] <= 1:
            fake_score += 0.2
        
        # Reviews with sentiment-rating mismatch might be fake
        if has_mismatch:
            fake_score += min(0.4, mismatch_severity)
        
        # Cap the score at 0.95
        fake_score = min(0.95, fake_score)
        
        return {
            "is_fake": fake_score > 0.7,
            "fake_score": float(fake_score),
            "sentiment_score": sentiment_features['sentiment_score'],
            "emotions": sentiment_features['emotions'],
            "reasons": self._get_sentiment_reasons(text, sentiment_features, rating, has_mismatch)
        }
    
    def analyze_reviews(self, texts, ratings=None):
        """
        Analyze multiple review texts
        
        Args:
            texts (list): List of review texts
            ratings (list, optional): List of ratings corresponding to the texts
            
        Returns:
            list: List of analysis results
        """
        if ratings is None:
            ratings = [None] * len(texts)
        
        return [self.analyze_review(text, rating) for text, rating in zip(texts, ratings)]
    
    def save_model(self):
        """Save the trained model to disk"""
        if self.model is not None:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump({
                'model': self.model,
                'vectorizer': self.vectorizer
            }, self.model_path)
    
    def load_model(self):
        """Load the trained model from disk"""
        if os.path.exists(self.model_path):
            saved_model = joblib.load(self.model_path)
            self.model = saved_model['model']
            self.vectorizer = saved_model['vectorizer']
    
    def _extract_sentiment_features(self, text):
        """
        Extract sentiment and emotion features from text
        
        Args:
            text (str): The review text
            
        Returns:
            dict: Sentiment features
        """
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        
        # Simple rule-based sentiment scoring
        positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'awesome']
        negative_words = ['bad', 'poor', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing']
        
        positive_count = sum(word in positive_words for word in words)
        negative_count = sum(word in negative_words for word in words)
        
        # Calculate basic sentiment score (-1 to 1)
        total = positive_count + negative_count
        sentiment_score = 0
        if total > 0:
            sentiment_score = (positive_count - negative_count) / total
        
        # Detect emotions
        emotions = {}
        for emotion, emotion_words in self.emotion_lexicon.items():
            emotion_count = sum(word in emotion_words for word in words)
            if emotion_count > 0:
                emotions[emotion] = emotion_count
        
        return {
            'sentiment_score': sentiment_score,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'emotion_count': len(emotions),
            'emotions': emotions
        }
    
    def _get_sentiment_reasons(self, text, features, rating, has_mismatch):
        """
        Extract reasons for why a review might be fake based on sentiment analysis
        
        Args:
            text (str): The review text
            features (dict): Sentiment features
            rating (int): The star rating
            has_mismatch (bool): Whether there's a sentiment-rating mismatch
            
        Returns:
            list: Reasons why the review might be fake
        """
        reasons = []
        
        # Extreme sentiment without details
        if abs(features['sentiment_score']) > 0.7 and len(text.split()) < 30:
            if features['sentiment_score'] > 0:
                reasons.append("Extreme positive sentiment without supporting details")
            else:
                reasons.append("Extreme negative sentiment without supporting details")
        
        # Sentiment-rating mismatch
        if has_mismatch and rating is not None:
            if rating >= 4 and features['sentiment_score'] < -0.3:
                reasons.append(f"Positive rating ({rating}★) but negative sentiment in text")
            elif rating <= 2 and features['sentiment_score'] > 0.3:
                reasons.append(f"Negative rating ({rating}★) but positive sentiment in text")
        
        # Lack of emotional variation
        if features['emotion_count'] == 0 and len(text.split()) > 50:
            reasons.append("No emotional language in a long review")
        elif features['emotion_count'] == 1 and len(features['emotions']) == 1 and len(text.split()) > 50:
            emotion = list(features['emotions'].keys())[0]
            reasons.append(f"Limited emotional range (only {emotion})")
        
        return reasons
