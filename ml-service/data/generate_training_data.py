"""
Generate synthetic training data for context detection model
"""

import json
import random
from typing import List, Dict


class TrainingDataGenerator:
    """Generate synthetic training samples for Code, Email, and Chat contexts"""

    def __init__(self):
        # Code samples templates
        self.code_templates = [
            "function {name}({params}) {{ return {expr}; }}",
            "const {name} = ({params}) => {{ {body} }}",
            "class {name} {{ constructor({params}) {{ this.{field} = {value}; }} }}",
            "def {name}({params}): return {expr}",
            "for (let i = 0; i < {n}; i++) {{ {body} }}",
            "if ({condition}) {{ {body} }} else {{ {else_body} }}",
            "import {{ {modules} }} from '{package}';",
            "const {var} = {value}; const {var2} = {value2};",
            "async function {name}() {{ await {call}(); }}",
            "interface {name} {{ {field}: {type}; }}",
        ]

        # Email samples templates
        self.email_templates = [
            "Dear {name}, I hope this email finds you well. {content} Best regards, {sender}",
            "Hi {name}, Thank you for {action}. {content} Sincerely, {sender}",
            "Dear Dr. {name}, I am writing to {purpose}. {content} Regards, {sender}",
            "Hello {name}, I wanted to reach out regarding {topic}. {content} Thanks, {sender}",
            "Good morning {name}, Please find attached {attachment}. {content} Best, {sender}",
            "Dear {name}, I would like to {request}. {content} Kind regards, {sender}",
            "Hi {name}, Thank you for your email. {content} Looking forward to hearing from you. Best, {sender}",
        ]

        # Chat samples templates
        self.chat_templates = [
            "hey {name}! {message} lol {emoji}",
            "omg that's so {adj}!! {message} {emoji} {emoji}",
            "btw {message}... wanna {activity}? {emoji}",
            "{name} yo! {message} brb {emoji}",
            "haha {message}! idk tbh {emoji}",
            "{message}!!! omg {message2} {emoji} {emoji} {emoji}",
            "lol {message} btw {message2} 😂",
            "{name}!! {message} ngl {adj} af {emoji}",
        ]

        # Replacements
        self.code_names = ["calculate", "process", "handle", "fetch", "update", "create", "delete"]
        self.code_params = ["data", "id", "value", "config", "options", "callback"]
        self.code_exprs = ["data.length", "a + b", "true", "null", "result"]
        self.code_bodies = ["console.log(data)", "return value", "process(item)"]

        self.email_names = ["Smith", "Johnson", "Williams", "Brown", "Jones"]
        self.email_content = [
            "I would appreciate your feedback on this matter.",
            "Could you please provide an update at your earliest convenience?",
            "I look forward to our meeting next week.",
            "Please let me know if you have any questions.",
        ]

        self.chat_names = ["sarah", "mike", "alex", "emma"]
        self.chat_messages = [
            "that was amazing", "can't wait", "so excited", "miss you",
            "see you later", "that's crazy", "no way"
        ]
        self.chat_adjectives = ["cool", "awesome", "crazy", "amazing", "wild"]
        self.chat_activities = ["hang out", "grab coffee", "watch a movie", "go shopping"]
        self.chat_emojis = ["😊", "😂", "❤️", "👍", "🔥", "😎", "🎉", "💯"]

    def generate_code_sample(self) -> str:
        """Generate a code sample"""
        template = random.choice(self.code_templates)
        return template.format(
            name=random.choice(self.code_names),
            params=", ".join(random.sample(self.code_params, random.randint(1, 3))),
            expr=random.choice(self.code_exprs),
            body=random.choice(self.code_bodies),
            else_body=random.choice(self.code_bodies),
            condition="x > 0",
            n="10",
            modules=", ".join(random.sample(self.code_names, 2)),
            package="library",
            var="data",
            var2="result",
            value="[]",
            value2="{}",
            call=random.choice(self.code_names),
            field=random.choice(self.code_params),
            type="string"
        )

    def generate_email_sample(self) -> str:
        """Generate an email sample"""
        template = random.choice(self.email_templates)
        return template.format(
            name=random.choice(self.email_names),
            content=random.choice(self.email_content),
            sender=random.choice(self.email_names),
            action="your assistance",
            purpose="discuss the project timeline",
            topic="our upcoming meeting",
            attachment="the requested documents",
            request="schedule a meeting with you",
        )

    def generate_chat_sample(self) -> str:
        """Generate a chat sample"""
        template = random.choice(self.chat_templates)
        return template.format(
            name=random.choice(self.chat_names),
            message=random.choice(self.chat_messages),
            message2=random.choice(self.chat_messages),
            adj=random.choice(self.chat_adjectives),
            activity=random.choice(self.chat_activities),
            emoji=random.choice(self.chat_emojis)
        )

    def generate_dataset(
        self,
        n_samples_per_class: int = 100
    ) -> List[Dict[str, str]]:
        """
        Generate a balanced dataset

        Args:
            n_samples_per_class: Number of samples to generate per class

        Returns:
            List of dictionaries with 'text' and 'label' keys
        """
        dataset = []

        # Generate code samples
        for _ in range(n_samples_per_class):
            dataset.append({
                'text': self.generate_code_sample(),
                'label': 'code'
            })

        # Generate email samples
        for _ in range(n_samples_per_class):
            dataset.append({
                'text': self.generate_email_sample(),
                'label': 'email'
            })

        # Generate chat samples
        for _ in range(n_samples_per_class):
            dataset.append({
                'text': self.generate_chat_sample(),
                'label': 'chat'
            })

        # Shuffle
        random.shuffle(dataset)

        return dataset

    def save_dataset(self, dataset: List[Dict], filename: str = "training_data.json"):
        """Save dataset to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(dataset, f, indent=2, ensure_ascii=False)
        print(f"Dataset saved to {filename}")
        print(f"Total samples: {len(dataset)}")
        print(f"- Code: {sum(1 for d in dataset if d['label'] == 'code')}")
        print(f"- Email: {sum(1 for d in dataset if d['label'] == 'email')}")
        print(f"- Chat: {sum(1 for d in dataset if d['label'] == 'chat')}")


if __name__ == "__main__":
    # Generate training data
    generator = TrainingDataGenerator()

    # Generate 300 samples per class (900 total)
    dataset = generator.generate_dataset(n_samples_per_class=300)

    # Save to file
    generator.save_dataset(dataset, "data/training_data.json")

    # Print some examples
    print("\n=== Sample Examples ===\n")
    for label in ['code', 'email', 'chat']:
        samples = [d for d in dataset if d['label'] == label][:3]
        print(f"\n{label.upper()} Examples:")
        for i, sample in enumerate(samples, 1):
            print(f"{i}. {sample['text']}")
