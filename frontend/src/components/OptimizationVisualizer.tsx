import React, { useState, useEffect } from 'react';
import { useAppStore } from '../contexts/store';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';

const OptimizationVisualizer: React.FC = () => {
  const { currentContext, totalKeystrokes } = useAppStore();
  const [topKeys, setTopKeys] = useState<Array<{ key: string; count: number; frequency: number }>>([]);
  const [stats, setStats] = useState({
    totalKeys: 0,
    totalPresses: 0,
    avgPressesPerKey: 0,
    mostFrequentKey: null as { key: string; count: number; frequency: number } | null
  });
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  useEffect(() => {
    const updateData = () => {
      const keys = keyFrequencyTracker.getTopKeys(currentContext, 5);
      setTopKeys(keys.map(k => ({
        key: k.key,
        count: k.count,
        frequency: k.frequency
      })));

      const contextStats = keyFrequencyTracker.getStats(currentContext);
      setStats(contextStats);

      // Calculate optimization progress (0-100% based on keystrokes)
      // Need at least 100 keystrokes for meaningful optimization
      const progress = Math.min(100, (contextStats.totalPresses / 100) * 100);
      setOptimizationProgress(progress);
    };

    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, [currentContext, totalKeystrokes]);

  const getProgressColor = () => {
    if (optimizationProgress < 30) return 'bg-red-500';
    if (optimizationProgress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressMessage = () => {
    if (optimizationProgress < 30) return 'Collecting data... Keep typing!';
    if (optimizationProgress < 70) return 'Learning your patterns...';
    return 'Keyboard optimized!';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🧠 AI Optimization Status
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${optimizationProgress > 70 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">{optimizationProgress > 70 ? 'Active' : 'Learning'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">{getProgressMessage()}</span>
          <span className="font-medium text-gray-900">{Math.round(optimizationProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${getProgressColor()} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${optimizationProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stats.totalPresses} / 100 keystrokes needed for full optimization
        </p>
      </div>

      {/* Top Used Keys */}
      {topKeys.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Most Used Keys (optimized for larger size & closer position):
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {topKeys.map((keyData, index) => (
              <div
                key={keyData.key}
                className="relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-3 text-center"
              >
                {/* Rank badge */}
                <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Key character */}
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {keyData.key}
                </div>

                {/* Usage count */}
                <div className="text-xs text-gray-600">
                  {keyData.count} times
                </div>

                {/* Frequency bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${keyData.frequency * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalPresses}</div>
          <div className="text-xs text-gray-600">Total Keys</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalKeys}</div>
          <div className="text-xs text-gray-600">Unique Keys</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalPresses > 0 ? Math.round((topKeys[0]?.frequency || 0) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-600">Top Key Usage</div>
        </div>
      </div>

      {/* Fitts' Law Explanation */}
      {optimizationProgress > 70 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>✓ Fitts' Law Applied:</strong> Your most-used keys are now <strong>larger</strong> (easier to tap)
            and positioned <strong>closer to the center</strong> (faster to reach).
          </p>
        </div>
      )}
    </div>
  );
};

export default OptimizationVisualizer;
