import React, { useState } from 'react';
import { useOptimizedLayout } from '../hooks/useOptimizedLayout';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';
import { useAppStore } from '../contexts/store';

const LayoutPreferences: React.FC = () => {
  const {
    isOptimizationEnabled,
    toggleOptimization,
    regenerateLayout,
    recommendation,
    isLoading
  } = useOptimizedLayout();

  const { currentContext } = useAppStore();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const stats = keyFrequencyTracker.getStats(currentContext);

  const handleExportData = () => {
    const data = keyFrequencyTracker.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contexttype-frequencies-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        keyFrequencyTracker.importData(data);
        regenerateLayout();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        Layout Preferences
      </h3>

      {/* Optimization Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-800">Personalized Layout</h4>
            <p className="text-sm text-gray-600">
              Optimize keyboard based on your typing patterns
            </p>
          </div>
          <button
            onClick={toggleOptimization}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                       ${isOptimizationEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                       ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                         ${isOptimizationEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Status */}
        <div className={`text-sm px-3 py-2 rounded-lg ${
          isOptimizationEnabled
            ? 'bg-blue-50 text-blue-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          {isOptimizationEnabled
            ? '✅ Using personalized layout optimized with Fitts\' Law'
            : '📐 Using standard layout'
          }
        </div>
      </div>

      {/* Recommendation */}
      {stats.totalPresses > 0 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          recommendation.shouldUseOptimized
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {recommendation.shouldUseOptimized ? '💡' : 'ℹ️'}
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-800 mb-1">
                {recommendation.shouldUseOptimized ? 'Recommendation' : 'Keep Typing'}
              </h5>
              <p className="text-sm text-gray-700">
                {recommendation.reason}
              </p>
              {recommendation.estimatedImprovement > 0 && (
                <p className="text-sm font-semibold text-green-700 mt-2">
                  Estimated speed improvement: {recommendation.estimatedImprovement}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Training Progress
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.min(100, (stats.totalPresses / 100) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (stats.totalPresses / 100) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {stats.totalPresses < 100
            ? `${100 - stats.totalPresses} more key presses until optimal personalization`
            : 'Layout fully personalized!'}
        </p>
      </div>

      {/* Additional Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => {
              setShowHeatmap(e.target.checked);
              // You would pass this to the keyboard component
              window.dispatchEvent(new CustomEvent('toggle-heatmap', {
                detail: e.target.checked
              }));
            }}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-800">Show Key Heatmap</span>
            <p className="text-xs text-gray-600">Highlight frequently used keys</p>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={regenerateLayout}
          disabled={isLoading || !isOptimizationEnabled}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                     text-sm font-medium flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Regenerating...
            </>
          ) : (
            <>
              <span>🔄</span>
              Regenerate Layout
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                       transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Export
          </button>

          <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                           transition-colors text-sm font-medium flex items-center justify-center gap-2
                           cursor-pointer">
            <span>📤</span>
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all typing data? This cannot be undone.')) {
              keyFrequencyTracker.resetAll();
              regenerateLayout();
            }
          }}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100
                     transition-colors text-sm font-medium"
        >
          Reset All Data
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>💡 <strong>Tip:</strong> The more you type, the better your personalized layout becomes!</p>
        <p className="mt-2">
          Current context: <strong className="text-gray-700">{currentContext}</strong> •
          Keys tracked: <strong className="text-gray-700">{stats.totalKeys}</strong>
        </p>
      </div>
    </div>
  );
};

export default LayoutPreferences;
