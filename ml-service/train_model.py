"""
Train the context detection model
"""

import json
import sys
import os

# Add app to path
sys.path.insert(0, os.path.dirname(__file__))

from app.model import ContextDetectionModel
from data.generate_training_data import TrainingDataGenerator


def main():
    print("=" * 60)
    print("ContextType ML Model Training")
    print("=" * 60)

    # Step 1: Generate training data
    print("\n[1/3] Generating training data...")
    generator = TrainingDataGenerator()
    dataset = generator.generate_dataset(n_samples_per_class=300)

    # Save dataset
    os.makedirs("data", exist_ok=True)
    generator.save_dataset(dataset, "data/training_data.json")

    # Step 2: Extract texts and labels
    print("\n[2/3] Preparing dataset...")
    texts = [sample['text'] for sample in dataset]
    labels = [sample['label'] for sample in dataset]

    print(f"Total samples: {len(texts)}")
    print(f"- Code: {labels.count('code')}")
    print(f"- Email: {labels.count('email')}")
    print(f"- Chat: {labels.count('chat')}")

    # Step 3: Train model
    print("\n[3/3] Training model...")
    model = ContextDetectionModel(model_path="models/context_model.pkl")

    accuracy = model.train(texts, labels)

    print("\n" + "=" * 60)
    print(f"Training completed!")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("=" * 60)

    # Test with examples
    print("\n=== Testing Model ===\n")

    test_samples = [
        ("function add(a, b) { return a + b; }", "code"),
        ("Dear John, I hope this email finds you well. Best regards, Sarah", "email"),
        ("omg that's so cool! 😊 lol can't wait!!!", "chat"),
    ]

    for text, expected in test_samples:
        result = model.predict(text)
        correct = "✓" if result['context'] == expected else "✗"
        print(f"{correct} Text: {text[:50]}...")
        print(f"   Predicted: {result['context']} (confidence: {result['confidence']:.2f})")
        print(f"   Expected: {expected}\n")

    print("\nModel saved to: models/context_model.pkl")
    print("You can now start the ML service!")


if __name__ == "__main__":
    main()
