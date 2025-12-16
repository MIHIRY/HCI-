import React, { useState, useEffect } from 'react';
import { useAppStore } from '../contexts/store';

interface TextInputProps {
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ onTextChange, placeholder }) => {
  const { inputText, setInputText, incrementKeystrokes, currentContext } = useAppStore();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Update counts
    setCharCount(inputText.length);
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [inputText]);

  // Prevent direct keyboard input - force on-screen keyboard only
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Block any direct input from physical/native keyboard
    e.preventDefault();
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    const placeholders = {
      code: 'Start typing your code here...',
      email: 'Compose your email message...',
      chat: 'Type your message...'
    };

    return placeholders[currentContext];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Text Area */}
      <div className="relative">
        {/* Instruction banner */}
        <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          👇 Use the on-screen keyboard below to type. Physical keyboard is disabled for this demo.
        </div>

        <textarea
          value={inputText}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          readOnly
          className={`w-full h-48 p-4 border-2 rounded-lg resize-none focus:outline-none
                     focus:ring-2 transition-all font-mono text-sm cursor-default
                     ${currentContext === 'code' ? 'focus:border-blue-500 focus:ring-blue-200 bg-gray-50' : ''}
                     ${currentContext === 'email' ? 'focus:border-gray-500 focus:ring-gray-200 bg-white' : ''}
                     ${currentContext === 'chat' ? 'focus:border-purple-500 focus:ring-purple-200 bg-purple-50' : ''}
                   `}
          spellCheck={currentContext === 'email'}
        />

        {/* Character/Word Count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {charCount} chars | {wordCount} words
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex gap-4">
          <span>Characters: <strong>{charCount}</strong></span>
          <span>Words: <strong>{wordCount}</strong></span>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs font-medium
                          ${currentContext === 'code' ? 'bg-blue-100 text-blue-800' : ''}
                          ${currentContext === 'email' ? 'bg-gray-100 text-gray-800' : ''}
                          ${currentContext === 'chat' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
            {currentContext.toUpperCase()} Mode
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
