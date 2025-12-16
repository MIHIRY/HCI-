import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppStore } from './contexts/store';
import MobileKeyboard from './components/MobileKeyboard';
import TextInput from './components/TextInput';
import ContextIndicator from './components/ContextIndicator';
import MetricsDisplay from './components/MetricsDisplay';
import KeyHeatmap from './components/KeyHeatmap';
import LayoutPreferences from './components/LayoutPreferences';
import OptimizationVisualizer from './components/OptimizationVisualizer';
import SuggestionStrip from './components/SuggestionStrip'; // Phase 3
import { useSuggestions } from './hooks/useSuggestions'; // Phase 3
import type { ContextType, KeyboardLayout } from './types';
import type { Suggestion } from './components/SuggestionStrip'; // Phase 3
import { useOptimizedLayout } from './hooks/useOptimizedLayout';
import { detectContextWithHistory } from './utils/contextDetector'; // Client-side context detection
import { generateOptimizedLayout } from './utils/layoutOptimizer'; // Pre-import for performance

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function App() {
  const {
    currentContext,
    setContext,
    setLayout,
    inputText,
    startSession,
    setInputText,
    isCompactMode // Phase 2: Get compact mode state
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(true);

  // Use optimized layout hook
  const { isOptimizationEnabled } = useOptimizedLayout();

  // Layout cache: prevents regeneration on every context switch
  const layoutCacheRef = useRef<Map<string, KeyboardLayout>>(new Map());
  const contextSwitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Phase 3: Suggestion strip
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const { suggestions, isLoading: suggestionsLoading } = useSuggestions({
    text: inputText,
    context: currentContext,
    enabled: suggestionsEnabled && !isCompactMode,
    debounceMs: 500,
    maxSuggestions: 5
  });

  // Initialize session
  useEffect(() => {
    startSession();
    loadLayout(currentContext, true); // Initial load with loading state
  }, []);

  // Listen for heatmap toggle from LayoutPreferences
  useEffect(() => {
    const handleToggleHeatmap = (event: any) => {
      setShowHeatmap(event.detail);
    };

    window.addEventListener('toggle-heatmap', handleToggleHeatmap);
    return () => window.removeEventListener('toggle-heatmap', handleToggleHeatmap);
  }, []);

  // Load keyboard layout - use local optimization with caching
  const loadLayout = async (context: ContextType, isInitialLoad: boolean = false) => {
    try {
      // Only show loading state on initial load, not on context switches
      if (isInitialLoad) {
        setIsLoading(true);
      }

      // Check cache first
      const cacheKey = `${context}-${isOptimizationEnabled}`;
      if (layoutCacheRef.current.has(cacheKey)) {
        const cachedLayout = layoutCacheRef.current.get(cacheKey);
        if (cachedLayout) {
          setLayout(cachedLayout);
          setError(null);
          if (isInitialLoad) {
            setIsLoading(false);
          }
          return;
        }
      }

      // Generate new layout (already imported at top level)
      const optimizedLayout = generateOptimizedLayout(context, isOptimizationEnabled);

      // Cache the layout
      layoutCacheRef.current.set(cacheKey, optimizedLayout);

      // Limit cache size to 10 entries
      if (layoutCacheRef.current.size > 10) {
        const firstKey = layoutCacheRef.current.keys().next().value;
        layoutCacheRef.current.delete(firstKey);
      }

      setLayout(optimizedLayout);
      setError(null);
    } catch (err) {
      console.error('Failed to generate layout:', err);
      // Fallback to mock layout
      setLayout(getMockLayout(context));
      setError('Using fallback layout');
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  // Detect context from text input (client-side) - balanced switching
  const detectContext = (text: string) => {
    if (text.length < 5) return; // Lowered from 10 to 5 for faster detection

    try {
      // Use client-side context detection with balanced threshold
      // Built-in safeguards:
      // - 3 second cooldown after switching (reduced from 8)
      // - Strong signal override for clear code/email/chat patterns
      // - Sentence boundary detection (but more permissive)
      // - Natural language phrase detection
      // - Recent text weighting (70% recent, 30% full)
      const result = detectContextWithHistory(text, currentContext, 0.55); // Lowered from 0.65

      console.log('Context detection:', {
        text: text.substring(0, 50) + '...',
        detected: result.context,
        confidence: result.confidence.toFixed(2),
        scores: result.scores
      });

      // Only switch if context actually changed (detectContextWithHistory handles thresholds)
      if (result.context !== currentContext) {
        console.log(`✅ Switching context: ${currentContext} → ${result.context}`);
        setContext(result.context, result.confidence);
        loadLayout(result.context, false); // Not initial load - instant switch
      } else {
        console.log(`✓ Staying in ${currentContext} context (confidence: ${result.confidence.toFixed(2)})`);
      }
    } catch (err) {
      console.error('Context detection failed:', err);
    }
  };

  // Handle text changes - smart debouncing for instant context switching
  const handleTextChange = (text: string) => {
    setInputText(text);

    // Clear any pending context detection
    if (contextSwitchTimeoutRef.current) {
      clearTimeout(contextSwitchTimeoutRef.current);
    }

    // Fast debounce for responsive context switching (200ms)
    contextSwitchTimeoutRef.current = setTimeout(() => {
      detectContext(text);
    }, 200); // Reduced from 300ms to 200ms
  };

  // Handle manual context override - instant switching
  const handleContextOverride = (newContext: ContextType) => {
    setContext(newContext, 1.0);
    loadLayout(newContext, false); // Not initial load - instant switch
  };

  // Reload layout when optimization is toggled - clear cache and regenerate
  useEffect(() => {
    if (currentContext) {
      // Clear cache when optimization setting changes
      layoutCacheRef.current.clear();
      loadLayout(currentContext, false); // Not initial load
    }
  }, [isOptimizationEnabled]);

  // Handle keyboard key press from on-screen keyboard
  const handleKeyPress = (key: string) => {
    const { incrementKeystrokes } = useAppStore.getState();

    // Handle special keys
    if (key === '⌫') {
      // Backspace
      setInputText(inputText.slice(0, -1));
    } else if (key === 'DELETE_WORD') {
      // Phase 2: Delete word (swipe left on backspace)
      // Find the last word and delete it
      const trimmed = inputText.trimEnd(); // Remove trailing spaces
      const lastSpaceIndex = trimmed.lastIndexOf(' ');
      const lastNewlineIndex = trimmed.lastIndexOf('\n');
      const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);

      if (lastBreakIndex === -1) {
        // No space/newline found, delete everything
        setInputText('');
      } else {
        // Delete from last space/newline onwards
        setInputText(inputText.slice(0, lastBreakIndex + 1));
      }
      incrementKeystrokes();
    } else if (key === '␣' || key === 'Space') {
      // Space
      setInputText(inputText + ' ');
      incrementKeystrokes();
    } else if (key === '↵' || key === 'Enter') {
      // Enter
      setInputText(inputText + '\n');
      incrementKeystrokes();
    } else {
      // Regular character
      setInputText(inputText + key);
      incrementKeystrokes();
    }

    // Trigger context detection after adding text
    setTimeout(() => {
      detectContext(inputText + key);
    }, 100);
  };

  // Phase 3: Handle suggestion selection
  const handleSuggestionSelect = (suggestion: Suggestion) => {
    // Insert suggestion at cursor position with a space after
    // This creates a commit signal to trigger next predictions
    const newText = inputText + suggestion.text + ' ';
    setInputText(newText);

    // Increment keystrokes for the suggestion
    const { incrementKeystrokes } = useAppStore.getState();
    incrementKeystrokes();

    // Trigger context detection
    setTimeout(() => {
      detectContext(newText);
    }, 100);

    // The space at the end will trigger useSuggestions commit signal
    // for immediate next-word prediction (as per requirement)
  };

  // Mock layout for offline mode
  const getMockLayout = (context: ContextType): KeyboardLayout => {
    return {
      mode: context,
      version: '1.0',
      theme: context === 'code' ? 'code_blue' : context === 'email' ? 'professional_gray' : 'vibrant',
      layout: {
        rows: [
          {
            row_id: 1,
            keys: [
              { key_id: 'key1', character: context === 'code' ? '{' : context === 'email' ? '.' : '😊',
                position: { x: 100, y: 50 }, size: { width: 60, height: 60 },
                frequency_rank: 1, color: context === 'code' ? '#3b82f6' : context === 'email' ? '#6b7280' : '#8b5cf6' }
            ]
          }
        ]
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ContextType</h1>
              <p className="text-sm text-gray-600">Adaptive Keyboard System</p>
            </div>
            {error && (
              <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                {error}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full box-border">
        {/* Phase 3 Feature Toggle */}
        <div className="mb-6 flex items-center justify-end">
          <button
            onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <span>{showAdvancedFeatures ? '👁️' : '👁️‍🗨️'}</span>
            {showAdvancedFeatures ? 'Hide' : 'Show'} Advanced Features (Phase 3)
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ContextType...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Left Column: Context, Metrics & Advanced Features */}
            {/* Phase 2: Hide advanced features in compact mode */}
            {!isCompactMode && (
              <div className="space-y-6">
                <ContextIndicator onManualOverride={handleContextOverride} />
                <MetricsDisplay />

                {/* Phase 3: Advanced Features */}
                {showAdvancedFeatures && (
                  <>
                    <LayoutPreferences />
                    <KeyHeatmap />
                  </>
                )}
              </div>
            )}

            {/* Right Column: Input & Enhanced Keyboard */}
            <div className={isCompactMode ? 'col-span-1' : 'lg:col-span-2'} style={{ width: '100%' }}>
              {/* Phase 2: Hide optimization visualizer in compact mode */}
              {!isCompactMode && <OptimizationVisualizer />}

              <TextInput onTextChange={handleTextChange} />

              {/* Phase 3: Suggestion Strip */}
              {suggestionsEnabled && !isCompactMode && (
                <div className="my-3">
                  <SuggestionStrip
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                    isLoading={suggestionsLoading}
                    currentContext={currentContext}
                  />
                </div>
              )}

              <MobileKeyboard
                onKeyPress={handleKeyPress}
                showHeatmap={showHeatmap && !isCompactMode}
              />

              {/* Phase 3 Badge - Hidden in compact mode */}
              {isOptimizationEnabled && !isCompactMode && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-sm">
                    <span className="text-2xl">🚀</span>
                    <div className="text-left">
                      <p className="font-semibold text-blue-900">Phase 3: Fitts' Law Optimization Active</p>
                      <p className="text-xs text-blue-700">Your keyboard is personalized for maximum efficiency</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            ContextType - Intelligent Adaptive Keyboard Research Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
