import React, { useEffect, useState } from 'react';
import { useAppStore } from '../contexts/store';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';

const KeyHeatmap: React.FC = () => {
  const { currentContext } = useAppStore();
  const [topKeys, setTopKeys] = useState<Array<{ key: string; frequency: number; count: number }>>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    updateHeatmapData();

    // Update every 5 seconds
    const interval = setInterval(updateHeatmapData, 5000);
    return () => clearInterval(interval);
  }, [currentContext]);

  const updateHeatmapData = () => {
    const keys = keyFrequencyTracker.getTopKeys(currentContext, 15);
    setTopKeys(keys.map(k => ({
      key: k.key,
      frequency: k.frequency,
      count: k.count
    })));

    const contextStats = keyFrequencyTracker.getStats(currentContext);
    setStats(contextStats);
  };

  const getHeatColor = (frequency: number): string => {
    // Green -> Yellow -> Red
    if (frequency > 0.1) return 'bg-red-500';
    if (frequency > 0.05) return 'bg-orange-500';
    if (frequency > 0.02) return 'bg-yellow-500';
    if (frequency > 0.01) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getHeatColorText = (frequency: number): string => {
    if (frequency > 0.1) return 'text-red-700';
    if (frequency > 0.05) return 'text-orange-700';
    if (frequency > 0.02) return 'text-yellow-700';
    if (frequency > 0.01) return 'text-green-700';
    return 'text-blue-700';
  };

  if (!stats || stats.totalPresses === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Key Usage Heatmap
        </h3>
        <div className="text-center text-gray-500 py-8">
          <p>Start typing to see your key usage patterns!</p>
          <p className="text-sm mt-2">Data will appear after {100 - stats?.totalPresses || 100} more key presses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Key Usage Heatmap
        </h3>
        <button
          onClick={() => {
            if (confirm('Reset all key frequency data for this context?')) {
              keyFrequencyTracker.resetContext(currentContext);
              updateHeatmapData();
            }
          }}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPresses}</div>
          <div className="text-xs text-gray-600 mt-1">Total Presses</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalKeys}</div>
          <div className="text-xs text-gray-600 mt-1">Unique Keys</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats.avgPressesPerKey.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 mt-1">Avg Per Key</div>
        </div>
      </div>

      {/* Most Frequent Key Highlight */}
      {stats.mostFrequentKey && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Frequent Key</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stats.mostFrequentKey.key}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">
                {(stats.mostFrequentKey.frequency * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">{stats.mostFrequentKey.count} times</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Keys List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Top 15 Keys</h4>
        {topKeys.map((item, index) => {
          const percentage = (item.frequency * 100).toFixed(2);
          const barWidth = Math.max(5, Math.min(100, item.frequency * 500)); // Scale for visibility

          return (
            <div key={`${item.key}-${index}`} className="flex items-center gap-3">
              {/* Rank */}
              <div className="w-6 text-center text-sm font-semibold text-gray-500">
                #{index + 1}
              </div>

              {/* Key Character */}
              <div className={`w-16 h-10 flex items-center justify-center rounded-lg font-mono font-bold text-lg ${getHeatColor(item.frequency)} text-white shadow-sm`}>
                {item.key}
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getHeatColor(item.frequency)} transition-all duration-300`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className={`text-sm font-semibold w-16 text-right ${getHeatColorText(item.frequency)}`}>
                    {percentage}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.count} presses
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Heat Intensity:</p>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span>Very High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Extreme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyHeatmap;
