"""
Context Detection ML Model
Implements both rule-based and ML-based context detection
"""

import os
import pickle
import numpy as np
from typing import List, Dict, Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

from .preprocessor import TextPreprocessor


class ContextDetectionModel:
    """
    ML model for context detection
    Supports both rule-based and ML-based approaches
    """

    def __init__(self, model_path: str = "models/context_model.pkl"):
        self.model_path = model_path
        self.preprocessor = TextPreprocessor()
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),  # Unigrams and bigrams
            min_df=2
        )
        self.classifier = MultinomialNB(alpha=0.1)
        self.is_trained = False
        self.accuracy = None
        self.classes = ['code', 'email', 'chat']

        # Rule-based keywords (from Phase 1)
        self.code_keywords = [
            'function', 'class', 'def', 'const', 'let', 'var', 'import',
            'return', 'if', 'else', 'while', 'for', 'async', 'await'
        ]
        self.email_keywords = [
            'dear', 'sincerely', 'regards', 'thank you', 'attached',
            'meeting', 'please', 'subject'
        ]
        self.chat_keywords = [
            'lol', 'omg', 'btw', 'brb', 'tbh', 'idk', 'haha', 'emoji'
        ]

    def train(self, texts: List[str], labels: List[str]) -> float:
        """
        Train the ML model

        Args:
            texts: List of training texts
            labels: List of corresponding labels (code, email, chat)

        Returns:
            Training accuracy
        """
        # Preprocess texts
        processed_texts = [self.preprocessor.preprocess(text) for text in texts]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            processed_texts, labels, test_size=0.2, random_state=42, stratify=labels
        )

        # Vectorize
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)

        # Train classifier
        self.classifier.fit(X_train_vec, y_train)

        # Evaluate
        y_pred = self.classifier.predict(X_test_vec)
        self.accuracy = accuracy_score(y_test, y_pred)

        # Print classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=self.classes))

        self.is_trained = True

        # Save model
        self.save_model()

        return self.accuracy

    def predict(self, text: str) -> Dict:
        """
        Predict context using ML model

        Args:
            text: Input text

        Returns:
            Dictionary with context, confidence, and alternatives
        """
        if not self.is_trained:
            # Fallback to rule-based
            return self.predict_rule_based(text)

        # Preprocess
        processed_text = self.preprocessor.preprocess(text)

        # Vectorize
        text_vec = self.vectorizer.transform([processed_text])

        # Predict probabilities
        probabilities = self.classifier.predict_proba(text_vec)[0]
        predicted_class_idx = np.argmax(probabilities)
        predicted_class = self.classifier.classes_[predicted_class_idx]
        confidence = probabilities[predicted_class_idx]

        # Get alternatives
        alternatives = []
        for i, cls in enumerate(self.classifier.classes_):
            if cls != predicted_class:
                alternatives.append({
                    'context': cls,
                    'confidence': float(probabilities[i])
                })

        # Sort alternatives by confidence
        alternatives.sort(key=lambda x: x['confidence'], reverse=True)

        return {
            'context': predicted_class,
            'confidence': float(confidence),
            'alternatives': alternatives
        }

    def predict_rule_based(self, text: str) -> Dict:
        """
        Predict context using rule-based approach (from Phase 1)

        Args:
            text: Input text

        Returns:
            Dictionary with context, confidence, and alternatives
        """
        text_lower = text.lower()

        # Calculate scores
        code_score = self._calculate_code_score(text, text_lower)
        email_score = self._calculate_email_score(text, text_lower)
        chat_score = self._calculate_chat_score(text, text_lower)

        # Normalize
        total = code_score + email_score + chat_score
        if total == 0:
            total = 1

        scores = {
            'code': code_score / total,
            'email': email_score / total,
            'chat': chat_score / total
        }

        # Get prediction
        predicted_context = max(scores, key=scores.get)
        confidence = scores[predicted_context]

        # Get alternatives
        alternatives = [
            {'context': ctx, 'confidence': conf}
            for ctx, conf in scores.items()
            if ctx != predicted_context
        ]
        alternatives.sort(key=lambda x: x['confidence'], reverse=True)

        return {
            'context': predicted_context,
            'confidence': confidence,
            'alternatives': alternatives
        }

    def _calculate_code_score(self, text: str, text_lower: str) -> float:
        """Calculate code context score"""
        score = 0.0

        # Keywords
        for keyword in self.code_keywords:
            count = text_lower.count(keyword)
            score += count * 3

        # Symbols
        score += text.count('{') * 2
        score += text.count('}') * 2
        score += text.count('(') * 1
        score += text.count(')') * 1
        score += text.count(';') * 2
        score += text.count('=>') * 3

        # CamelCase
        import re
        camel_case = len(re.findall(r'\b[a-z]+[A-Z][a-zA-Z]*\b', text))
        score += camel_case * 2

        # snake_case
        snake_case = len(re.findall(r'\b[a-z]+_[a-z_]+\b', text))
        score += snake_case * 2

        return score

    def _calculate_email_score(self, text: str, text_lower: str) -> float:
        """Calculate email context score"""
        score = 0.0

        # Keywords
        for keyword in self.email_keywords:
            if keyword in text_lower:
                score += 4

        # Punctuation
        score += text.count(',') * 0.5
        score += text.count('.') * 0.5

        # Formal greetings
        if 'dear' in text_lower or 'sincerely' in text_lower:
            score += 5

        return score

    def _calculate_chat_score(self, text: str, text_lower: str) -> float:
        """Calculate chat context score"""
        score = 0.0

        # Keywords/slang
        for keyword in self.chat_keywords:
            count = text_lower.count(keyword)
            score += count * 5

        # Emojis
        import re
        emoji_pattern = r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF]'
        emojis = len(re.findall(emoji_pattern, text))
        score += emojis * 6

        # Repeated punctuation
        score += len(re.findall(r'[!?]{2,}', text)) * 3

        # ALL CAPS
        score += len(re.findall(r'\b[A-Z]{2,}\b', text)) * 2

        return score

    def save_model(self, path: Optional[str] = None):
        """Save model to disk"""
        if path is None:
            path = self.model_path

        os.makedirs(os.path.dirname(path), exist_ok=True)

        model_data = {
            'vectorizer': self.vectorizer,
            'classifier': self.classifier,
            'accuracy': self.accuracy,
            'is_trained': self.is_trained
        }

        joblib.dump(model_data, path)
        print(f"Model saved to {path}")

    def load_model(self, path: Optional[str] = None) -> bool:
        """Load model from disk"""
        if path is None:
            path = self.model_path

        if not os.path.exists(path):
            print(f"Model file not found: {path}")
            return False

        try:
            model_data = joblib.load(path)
            self.vectorizer = model_data['vectorizer']
            self.classifier = model_data['classifier']
            self.accuracy = model_data['accuracy']
            self.is_trained = model_data['is_trained']
            print(f"Model loaded from {path}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def get_accuracy(self) -> Optional[float]:
        """Get model accuracy"""
        return self.accuracy

    def get_feature_count(self) -> int:
        """Get number of features"""
        if self.is_trained:
            return len(self.vectorizer.get_feature_names_out())
        return 0

    def get_classes(self) -> List[str]:
        """Get list of classes"""
        return self.classes
