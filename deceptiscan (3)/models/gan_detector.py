import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import re

class GANDetector:
    """
    Detector for AI-generated review content using text features common in LLM output
    """
    
    def __init__(self, model_path="models/gan_detector_model.pkl"):
        self.model_path = model_path
        self.vectorizer = CountVectorizer(
            ngram_range=(1, 2),
            max_features=5000,
            analyzer='word'
        )
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
    
    def train(self, texts, labels):
        """
        Train the GAN detector model
        
        Args:
            texts (list): List of review texts
            labels (list): Binary labels (1 for AI-generated, 0 for human-written)
        """
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        
        # Save the model
        self.save_model()
    
    def analyze_review(self, text):
        """
        Analyze a single review text for AI-generated patterns
        
        Args:
            text (str): The review text to analyze
            
        Returns:
            dict: Analysis result with prediction and confidence score
        """
        # Extract features that might indicate AI generation
        features = self._extract_ai_features(text)
        
        # For demo purposes, calculate a fake score based on features
        fake_score = self._calculate_ai_score(features)
        
        return {
            "is_ai_generated": fake_score > 0.7,
            "ai_score": float(fake_score),
            "features": features,
            "reasons": self._get_ai_reasons(text, features, fake_score)
        }
    
    def analyze_reviews(self, texts):
        """
        Analyze multiple review texts
        
        Args:
            texts (list): List of review texts
            
        Returns:
            list: List of analysis results
        """
        return [self.analyze_review(text) for text in texts]
    
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
    
    def _extract_ai_features(self, text):
        """
        Extract features that might indicate AI generation
        
        Args:
            text (str): The review text
            
        Returns:
            dict: AI-related text features
        """
        # Normalize text
        text_lower = text.lower()
        words = text_lower.split()
        
        # Word count
        word_count = len(words)
        
        # Average word length
        avg_word_len = np.mean([len(w) for w in words]) if words else 0
        
        # Sentence count
        sentences = re.split(r'[.!?]+', text)
        sentence_count = len([s for s in sentences if s.strip()])
        
        # Average sentence length
        avg_sent_len = word_count / sentence_count if sentence_count > 0 else 0
        
        # Common AI patterns
        has_typical_phrase = any(phrase in text_lower for phrase in [
            "i would recommend", 
            "i highly recommend",
            "in conclusion",
            "overall experience",
            "in summary",
            "in my opinion"
        ])
        
        # Check for balanced structure (e.g., 'pros and cons')
        has_balanced_structure = bool(re.search(r'\b(pros|advantages|benefits).{1,50}(cons|disadvantages|drawbacks)\b', text_lower))
        
        # Check for redundant adjectives
        adjectives = ["great", "good", "amazing", "excellent", "wonderful", "fantastic", "awesome"]
        adj_count = sum(text_lower.count(adj) for adj in adjectives)
        adj_ratio = adj_count / word_count if word_count > 0 else 0
        
        # Repeated sentence structures
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        sentence_starters = [s.split()[0].lower() if s.split() else "" for s in sentences]
        unique_starters_ratio = len(set(sentence_starters)) / len(sentence_starters) if sentence_starters else 0
        
        return {
            "word_count": word_count,
            "avg_word_len": avg_word_len,
            "sentence_count": sentence_count,
            "avg_sent_len": avg_sent_len,
            "has_typical_phrase": has_typical_phrase,
            "has_balanced_structure": has_balanced_structure,
            "adj_ratio": adj_ratio,
            "unique_starters_ratio": unique_starters_ratio
        }
    
    def _calculate_ai_score(self, features):
        """
        Calculate an AI-generation likelihood score based on features
        
        Args:
            features (dict): AI-related text features
            
        Returns:
            float: AI score between 0 and 1
        """
        score = 0.0
        
        # Very short or very long reviews might be suspicious
        if features["sentence_count"] == 1:
            score += 0.1
        elif features["sentence_count"] > 10:
            score += 0.2
        
        # Overly consistent sentence length is suspicious
        if 15 < features["avg_sent_len"] < 25:
            score += 0.15
        
        # Typical LLM phrases
        if features
