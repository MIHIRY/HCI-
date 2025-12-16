import React, { useState, useEffect } from 'react';
import { useAppStore } from '../contexts/store';

const MetricsDisplay: React.FC = () => {
  const { totalKeystrokes, startTime, inputText } = useAppStore();
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // seconds
      setElapsedTime(elapsed);

      // Calculate WPM: (characters / 5) / (time in minutes)
      const minutes = elapsed / 60;
      if (minutes > 0) {
        const calculatedWpm = (inputText.length / 5) / minutes;
        setWpm(Math.round(calculatedWpm));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, inputText]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* WPM */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-3xl font-bold text-blue-600">{wpm}</div>
          <div className="text-xs text-gray-600 mt-1">Words Per Minute</div>
        </div>

        {/* Keystrokes */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-3xl font-bold text-green-600">{totalKeystrokes}</div>
          <div className="text-xs text-gray-600 mt-1">Total Keystrokes</div>
        </div>

        {/* Characters */}
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-3xl font-bold text-orange-600">{inputText.length}</div>
          <div className="text-xs text-gray-600 mt-1">Characters Typed</div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
