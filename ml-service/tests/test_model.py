"""
Unit tests for context detection model
"""

import pytest
import sys
import os

# Add app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.model import ContextDetectionModel
from app.preprocessor import TextPreprocessor


class TestContextDetectionModel:
    """Test cases for ContextDetectionModel"""

    def setup_method(self):
        """Setup test fixtures"""
        self.model = ContextDetectionModel()
        self.preprocessor = TextPreprocessor()

    def test_rule_based_code_detection(self):
        """Test rule-based code context detection"""
        code_samples = [
            "function add(a, b) { return a + b; }",
            "const data = [1, 2, 3]; for (let i = 0; i < data.length; i++) { console.log(i); }",
            "class Person { constructor(name) { this.name = name; } }",
            "def calculate(x, y): return x + y",
        ]

        for sample in code_samples:
            result = self.model.predict_rule_based(sample)
            assert result['context'] == 'code', f"Failed for: {sample}"
            assert result['confidence'] > 0.3, "Confidence too low"

    def test_rule_based_email_detection(self):
        """Test rule-based email context detection"""
        email_samples = [
            "Dear John, I hope this email finds you well. Best regards, Sarah",
            "Hi Dr. Smith, Thank you for your assistance. Sincerely, Mike",
            "Good morning, Please find attached the requested documents. Thanks, Emma",
        ]

        for sample in email_samples:
            result = self.model.predict_rule_based(sample)
            assert result['context'] == 'email', f"Failed for: {sample}"
            assert result['confidence'] > 0.3, "Confidence too low"

    def test_rule_based_chat_detection(self):
        """Test rule-based chat context detection"""
        chat_samples = [
            "omg that's so cool! lol 😊",
            "btw are you coming tonight? haha can't wait!!!",
            "yo! that was amazing 😂😂😂",
        ]

        for sample in chat_samples:
            result = self.model.predict_rule_based(sample)
            assert result['context'] == 'chat', f"Failed for: {sample}"
            assert result['confidence'] > 0.3, "Confidence too low"

    def test_confidence_range(self):
        """Test that confidence scores are in valid range"""
        test_text = "function test() { return true; }"
        result = self.model.predict_rule_based(test_text)

        assert 0.0 <= result['confidence'] <= 1.0, "Confidence out of range"

    def test_alternatives_returned(self):
        """Test that alternative predictions are returned"""
        test_text = "function test() { return true; }"
        result = self.model.predict_rule_based(test_text)

        assert 'alternatives' in result, "Alternatives not returned"
        assert len(result['alternatives']) == 2, "Should have 2 alternatives"

        # Check alternatives are sorted by confidence
        confidences = [alt['confidence'] for alt in result['alternatives']]
        assert confidences == sorted(confidences, reverse=True), "Alternatives not sorted"

    def test_empty_text_handling(self):
        """Test handling of very short text"""
        # This should default to some context without crashing
        result = self.model.predict_rule_based("a")
        assert result['context'] in ['code', 'email', 'chat']

    def test_mixed_content(self):
        """Test detection with mixed context indicators"""
        # Text with both code and email indicators
        mixed_text = "Dear John, here's the function: def test(): return 42"
        result = self.model.predict_rule_based(mixed_text)

        # Should pick one based on stronger indicators
        assert result['context'] in ['code', 'email', 'chat']

    def test_model_save_load(self):
        """Test model persistence"""
        # Train a simple model
        texts = [
            "function test() {}", "const x = 1;", "class Foo {}",
            "Dear Sir,", "Best regards,", "Thank you,",
            "lol omg", "haha btw", "😊 cool"
        ]
        labels = ['code', 'code', 'code', 'email', 'email', 'email', 'chat', 'chat', 'chat']

        self.model.train(texts, labels)
        assert self.model.is_trained

        # Save model
        test_path = "test_model.pkl"
        self.model.save_model(test_path)

        # Load in new model instance
        new_model = ContextDetectionModel()
        success = new_model.load_model(test_path)

        assert success, "Model loading failed"
        assert new_model.is_trained, "Loaded model not marked as trained"

        # Clean up
        if os.path.exists(test_path):
            os.remove(test_path)


class TestTextPreprocessor:
    """Test cases for TextPreprocessor"""

    def setup_method(self):
        """Setup test fixtures"""
        self.preprocessor = TextPreprocessor()

    def test_basic_preprocessing(self):
        """Test basic text preprocessing"""
        text = "  Hello   World  "
        result = self.preprocessor.preprocess(text)

        assert result == "hello world", f"Got: {result}"

    def test_special_char_preservation(self):
        """Test that code symbols are preserved"""
        text = "function test() { return true; }"
        result = self.preprocessor.preprocess(text)

        assert '{' in result, "Braces not preserved"
        assert '}' in result
        assert '(' in result
        assert ';' in result

    def test_tokenization(self):
        """Test text tokenization"""
        text = "Hello world, this is a test!"
        tokens = self.preprocessor.tokenize(text)

        assert isinstance(tokens, list), "Tokens should be a list"
        assert 'hello' in tokens, "Missing token"
        assert 'world' in tokens
        assert 'test' in tokens

    def test_stop_word_removal(self):
        """Test stop word removal"""
        tokens = ['the', 'quick', 'brown', 'fox', 'and', 'the', 'dog']
        filtered = self.preprocessor.remove_stop_words(tokens)

        assert 'quick' in filtered, "Content word removed"
        assert 'brown' in filtered
        assert 'the' not in filtered, "Stop word not removed"
        assert 'and' not in filtered

    def test_feature_extraction(self):
        """Test feature extraction"""
        text = "function test() { return 42; }"
        features = self.preprocessor.extract_features(text)

        assert isinstance(features, dict), "Features should be a dict"
        assert 'text_length' in features
        assert 'word_count' in features
        assert 'has_braces' in features
        assert features['has_braces'] == True, "Should detect braces"
        assert features['has_parentheses'] == True, "Should detect parentheses"

    def test_emoji_detection(self):
        """Test emoji detection in features"""
        text = "Hello! 😊 How are you?"
        features = self.preprocessor.extract_features(text)

        assert features['has_emoji'] == True, "Should detect emoji"

    def test_slang_detection(self):
        """Test slang detection"""
        text = "omg that's so lol btw"
        features = self.preprocessor.extract_features(text)

        assert features['has_slang'] == True, "Should detect slang"

    def test_formal_greeting_detection(self):
        """Test formal greeting detection"""
        text = "Dear Sir, Regards"
        features = self.preprocessor.extract_features(text)

        assert features['has_formal_greeting'] == True, "Should detect formal greeting"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
