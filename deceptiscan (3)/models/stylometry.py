import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
import joblib
import os

class StyleAnalyzer:
    """
    Language Stylometry Analyzer that detects unnatural or robotic writing styles.
    Uses SVM model with TF-IDF features.
    """
    
    def __init__(self, model_path="models/stylometry_model.pkl"):
        self.model_path = model_path
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3), 
            max_features=10000,
            stop_words='english'
        )
        self.model = None
        
        # Load model if it exists, otherwise create a new one
        if os.path.exists(model_path):
            try:
                self.load_model()
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = SVC(probability=True)
        else:
            self.model = SVC(probability=True)
    
    def train(self, texts, labels):
        """
        Train the stylometry model
        
        Args:
            texts (list): List of review texts
            labels (list): Binary labels (1 for fake, 0 for genuine)
        """
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        
        # Save the model
        self.save_model()
    
    def analyze_review(self, text):
        """
        Analyze a single review text for stylometry patterns
        
        Args:
            text (str): The review text to analyze
            
        Returns:
            dict: Analysis result with prediction and confidence score
        """
        # If model isn't trained, return a mock result
        if not hasattr(self.model, 'predict_proba'):
            # Mock result with randomized score for demo
            fake_score = np.random.beta(2, 5)  # Beta distribution skewed toward lower scores
            if "amazing" in text.lower() and "best" in text.lower() and len(text) < 100:
                fake_score = np.random.uniform(0.7, 0.9)  # Higher score for suspicious text
            
            return {
                "is_fake": fake_score > 0.7,
                "fake_score": float(fake_score),
                "reasons": self._get_stylometry_reasons(text, fake_score)
            }
        
        # Real analysis for trained model
        X = self.vectorizer.transform([text])
        prediction = self.model.predict(X)[0]
        proba = self.model.predict_proba(X)[0]
        fake_score = proba[1]  # Probability of being fake
        
        return {
            "is_fake": prediction == 1,
            "fake_score": float(fake_score),
            "reasons": self._get_stylometry_reasons(text, fake_score)
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
    
    def _get_stylometry_reasons(self, text, fake_score):
        """
        Extract reasons for why a review might be fake based on stylometry
        
        Args:
            text (str): The review text
            fake_score (float): The fake probability score
            
        Returns:
            list: Reasons why the review might be fake
        """
        reasons = []
        
        if fake_score < 0.7:
            return reasons
            
        text_lower = text.lower()
        
        # Check for excessive superlatives
        superlatives = ["best", "amazing", "incredible", "perfect", "awesome", "excellent"]
        superlative_count = sum(word in text_lower for word in superlatives)
        if superlative_count >= 2 and len(text.split()) < 50:
            reasons.append("Excessive superlatives")
        
        # Check for lack of specific details
        if len(text.split()) < 20:
            reasons.append("Too short, lacks details")
        elif "product" in text_lower and not any(specific in text_lower for specific in ["feature", "battery", "design", "quality", "price", "performance"]):
            reasons.append("Generic praise without specific details")
        
        # Check for exclamation marks
        if text.count("!") > 2:
            reasons.append("Excessive exclamation marks")
        
        return reasons
