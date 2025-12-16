"""
Text preprocessing for context detection
"""

import re
import string
from typing import List


class TextPreprocessor:
    """
    Preprocess text for ML model
    """

    def __init__(self):
        self.stop_words = self._load_stop_words()

    def _load_stop_words(self) -> set:
        """Load common English stop words"""
        # Basic stop words - can be expanded
        return {
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'you', 'your', 'this', 'but', 'or'
        }

    def preprocess(self, text: str, keep_special_chars: bool = True) -> str:
        """
        Main preprocessing function

        Args:
            text: Raw input text
            keep_special_chars: Keep programming symbols and punctuation

        Returns:
            Preprocessed text
        """
        # Convert to lowercase for consistency
        text = text.lower()

        # Preserve important patterns before cleaning
        # 1. Preserve code symbols
        code_symbols = ['{', '}', '(', ')', '[', ']', ';', ':', '=>', '===', '!=', '==']
        symbol_placeholders = {}
        if keep_special_chars:
            for i, symbol in enumerate(code_symbols):
                placeholder = f"__SYMBOL{i}__"
                symbol_placeholders[placeholder] = symbol
                text = text.replace(symbol, f" {placeholder} ")

        # 2. Preserve emojis
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags
            "\U00002702-\U000027B0"
            "\U000024C2-\U0001F251"
            "]+",
            flags=re.UNICODE
        )
        emojis = emoji_pattern.findall(text)
        for i, emoji in enumerate(emojis):
            placeholder = f"__EMOJI{i}__"
            text = text.replace(emoji, f" {placeholder} ")

        # 3. Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()

        # Restore symbols and emojis
        for placeholder, symbol in symbol_placeholders.items():
            text = text.replace(placeholder, symbol)

        for i, emoji in enumerate(emojis):
            text = text.replace(f"__EMOJI{i}__", emoji)

        return text

    def tokenize(self, text: str) -> List[str]:
        """
        Tokenize text into words
        """
        # Simple word tokenization
        tokens = re.findall(r'\b\w+\b', text.lower())
        return tokens

    def remove_stop_words(self, tokens: List[str]) -> List[str]:
        """
        Remove common stop words
        """
        return [token for token in tokens if token not in self.stop_words]

    def extract_features(self, text: str) -> dict:
        """
        Extract features for ML model

        Returns:
            Dictionary of features
        """
        features = {}

        # Basic stats
        features['text_length'] = len(text)
        features['word_count'] = len(text.split())

        # Character-level features
        features['digit_count'] = sum(c.isdigit() for c in text)
        features['upper_count'] = sum(c.isupper() for c in text)
        features['special_char_count'] = sum(not c.isalnum() and not c.isspace() for c in text)

        # Code indicators
        features['has_braces'] = '{' in text or '}' in text
        features['has_brackets'] = '[' in text or ']' in text
        features['has_parentheses'] = '(' in text or ')' in text
        features['has_semicolon'] = ';' in text
        features['has_arrow'] = '=>' in text or '->' in text

        # Email indicators
        features['has_formal_greeting'] = any(
            word in text.lower() for word in ['dear', 'sincerely', 'regards']
        )
        features['has_email_marker'] = '@' in text or 'subject:' in text.lower()
        features['comma_count'] = text.count(',')
        features['period_count'] = text.count('.')

        # Chat indicators
        features['has_emoji'] = bool(
            re.search(r'[\U0001F600-\U0001F64F]', text)
        )
        features['has_slang'] = any(
            word in text.lower() for word in ['lol', 'omg', 'btw', 'brb']
        )
        features['has_repeated_punctuation'] = bool(
            re.search(r'[!?]{2,}', text)
        )
        features['exclamation_count'] = text.count('!')
        features['question_count'] = text.count('?')

        return features

    def get_n_grams(self, tokens: List[str], n: int = 2) -> List[str]:
        """
        Generate n-grams from tokens
        """
        n_grams = []
        for i in range(len(tokens) - n + 1):
            n_gram = ' '.join(tokens[i:i+n])
            n_grams.append(n_gram)
        return n_grams
