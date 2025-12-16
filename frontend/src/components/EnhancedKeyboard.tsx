import React, { useState, useEffect } from 'react';
import { useAppStore } from '../contexts/store';
import type { KeyConfig, SpecialButton } from '../types';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';

interface EnhancedKeyboardProps {
  onKeyPress?: (key: string) => void;
  showHeatmap?: boolean;
  enableAnimations?: boolean;
}

const EnhancedKeyboard: React.FC<EnhancedKeyboardProps> = ({
  onKeyPress,
  showHeatmap = false,
  enableAnimations = true
}) => {
  const { currentLayout, currentContext } = useAppStore();
  const [heatmapData, setHeatmapData] = useState<Map<string, number>>(new Map());
  const [animatingKeys, setAnimatingKeys] = useState<Set<string>>(new Set());

  // Update heatmap data
  useEffect(() => {
    if (showHeatmap) {
      const data = keyFrequencyTracker.getHeatmapData(currentContext);
      const map = new Map<string, number>();
      data.forEach(({ key, intensity }) => map.set(key, intensity));
      setHeatmapData(map);
    }
  }, [currentContext, showHeatmap]);

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading optimized keyboard...</p>
        </div>
      </div>
    );
  }

  const handleKeyClick = (character: string, keyId: string) => {
    // Animate key press
    if (enableAnimations) {
      setAnimatingKeys(prev => new Set(prev).add(keyId));
      setTimeout(() => {
        setAnimatingKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyId);
          return newSet;
        });
      }, 150);
    }

    // Track frequency
    keyFrequencyTracker.recordKeyPress(character, currentContext);

    // Call parent handler
    if (onKeyPress) {
      onKeyPress(character);
    }

    // Update heatmap if shown
    if (showHeatmap) {
      const data = keyFrequencyTracker.getHeatmapData(currentContext);
      const map = new Map<string, number>();
      data.forEach(({ key, intensity }) => map.set(key, intensity));
      setHeatmapData(map);
    }
  };

  const getKeyClassName = (key: KeyConfig, keyId: string) => {
    const baseClasses = 'keyboard-key transition-all duration-300 relative overflow-hidden';
    const contextClasses = {
      code: 'keyboard-key-code',
      email: 'keyboard-key-email',
      chat: 'keyboard-key-chat'
    };

    const isAnimating = animatingKeys.has(keyId);
    const animationClass = isAnimating ? 'scale-95 brightness-110' : 'scale-100';

    return `${baseClasses} ${contextClasses[currentContext]} ${animationClass}`;
  };

  const getHeatmapOverlay = (character: string) => {
    if (!showHeatmap) return null;

    const intensity = heatmapData.get(character) || 0;

    if (intensity === 0) return null;

    const opacity = Math.min(0.7, intensity);
    const heatColor = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#10b981';

    return (
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: heatColor,
          opacity: opacity
        }}
      />
    );
  };

  const getKeyTooltip = (key: KeyConfig) => {
    if (!showHeatmap) return key.character;

    const frequency = keyFrequencyTracker.getKeyFrequency(key.character, currentContext);
    const percentage = (frequency * 100).toFixed(1);

    return `${key.character} (${percentage}% usage)`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">⌨️</span>
            {currentLayout.mode.charAt(0).toUpperCase() + currentLayout.mode.slice(1)} Mode
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentLayout.version} • Optimized with Fitts' Law
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Context Badge */}
          <div className={`context-badge context-badge-${currentContext} flex items-center gap-2`}>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            {currentContext.toUpperCase()}
          </div>

          {/* Heatmap Toggle */}
          {showHeatmap && (
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              🔥 Heatmap Active
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Layout */}
      <div className="space-y-3 mb-6">
        {currentLayout.layout.rows.map((row, rowIndex) => (
          <div
            key={row.row_id}
            className="flex gap-2 justify-start"
            style={{
              animationDelay: enableAnimations ? `${rowIndex * 50}ms` : '0ms'
            }}
          >
            {row.keys.map((key, keyIndex) => (
              <button
                key={key.key_id}
                className={getKeyClassName(key, key.key_id)}
                style={{
                  width: `${key.size.width}px`,
                  height: `${key.size.height}px`,
                  backgroundColor: key.color,
                  color: currentContext === 'chat' && key.character.match(/[\u{1F600}-\u{1F64F}]/u)
                    ? 'transparent'
                    : 'white',
                  fontSize: key.size.width > 60 ? '16px' : '14px',
                  fontWeight: key.frequency_rank > 50 ? 'bold' : 'normal',
                  transform: enableAnimations ? `translateY(${keyIndex * 2}px)` : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => handleKeyClick(key.character, key.key_id)}
                title={getKeyTooltip(key)}
              >
                {/* Heatmap Overlay */}
                {getHeatmapOverlay(key.character)}

                {/* Key Character */}
                <span className="relative z-10 text-sm md:text-base font-mono drop-shadow-sm">
                  {key.character}
                </span>

                {/* Frequency Indicator (small badge) */}
                {key.frequency_rank > 70 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-60"></span>
                )}

                {/* Ripple effect on press */}
                {animatingKeys.has(key.key_id) && enableAnimations && (
                  <span className="absolute inset-0 bg-white opacity-30 rounded-lg animate-ping"></span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Special Buttons */}
      {currentLayout.special_buttons && currentLayout.special_buttons.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex gap-3 flex-wrap">
            {currentLayout.special_buttons.map((button: SpecialButton) => (
              <button
                key={button.button_id}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg
                           hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105
                           text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => console.log(`Action: ${button.action}`)}
              >
                <span className="text-lg">{getButtonIcon(button.action)}</span>
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Layout: {currentLayout.mode} v{currentLayout.version}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>Theme: {currentLayout.theme}</span>
          {(currentLayout as any).metadata?.avgMovementTime && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Avg Movement: {(currentLayout as any).metadata.avgMovementTime}ms</span>
            </>
          )}
        </div>

        {showHeatmap && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            </div>
            <span className="text-xs">Low → High Usage</span>
          </div>
        )}
      </div>

      {/* Optimization Badge */}
      {currentLayout.version.includes('optimized') && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Personalized for your typing patterns
          </span>
        </div>
      )}
    </div>
  );
};

// Helper function to get icon for button action
function getButtonIcon(action: string): string {
  const icons: { [key: string]: string } = {
    show_autocomplete: '✨',
    show_snippets: '📝',
    show_templates: '📄',
    insert_signature: '✍️',
    show_emoji_picker: '😊',
    show_gif_picker: '🎬'
  };

  return icons[action] || '⚡';
}

export default EnhancedKeyboard;
