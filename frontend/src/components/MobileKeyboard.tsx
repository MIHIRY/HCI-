import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../contexts/store';
import { keyFrequencyTracker } from '../utils/keyFrequencyTracker';
import { useMobileDetection, calculateKeyWidth, getKeyConstraints } from '../hooks/useMobileDetection';
import { useLongPress } from '../hooks/useLongPress';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { getAlternatesForKey, hasAlternates } from '../config/alternateKeys';
import AlternateKeysPopup from './AlternateKeysPopup';
import SymbolPanel from './SymbolPanel';
import {
  GRID_CONFIG,
  LETTER_ROWS,
  NUMBER_SYMBOL_ROWS,
  SPECIAL_KEYS,
  CONTEXT_COLORS,
  calculateKeySize,
  getKeyColorWithFrequency,
} from '../config/mobileLayout';

interface MobileKeyboardProps {
  onKeyPress?: (key: string) => void;
  showHeatmap?: boolean;
}

const MobileKeyboard: React.FC<MobileKeyboardProps> = ({ onKeyPress, showHeatmap = false }) => {
  const { currentContext, isCompactMode, toggleCompactMode } = useAppStore();
  const [shifted, setShifted] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<'letters' | 'numbers'>('letters');
  const [, setHeatmapData] = useState<Map<string, number>>(new Map());
  const [demoMode, setDemoMode] = useState(false);

  // Phase 2: Long-press popup state
  const [showAlternatesPopup, setShowAlternatesPopup] = useState(false);
  const [popupKey, setPopupKey] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const keyRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Phase 2: Cursor movement state (long-press space)
  const [isCursorMode, setIsCursorMode] = useState(false);
  const [cursorDelta, setCursorDelta] = useState(0);

  // Symbol Panel state
  const [isSymbolPanelOpen, setIsSymbolPanelOpen] = useState(false);

  // Phase 1: Mobile detection and responsive grid
  const mobileDetection = useMobileDetection();
  const { viewportWidth, columns, isMobile } = mobileDetection;

  // Update heatmap
  useEffect(() => {
    if (showHeatmap) {
      const data = keyFrequencyTracker.getHeatmapData(currentContext);
      const map = new Map<string, number>();
      data.forEach(({ key, intensity }) => map.set(key, intensity));
      setHeatmapData(map);
    }
  }, [currentContext, showHeatmap]);

  // Phase 1: Calculate responsive key dimensions
  const keyWidth = calculateKeyWidth(viewportWidth, columns, GRID_CONFIG.GAP);
  const keyHeight = keyWidth; // Square keys for now
  const { minSize, maxSize } = getKeyConstraints(viewportWidth);

  // Use layout constants from Phase 1 config
  const letterRows = LETTER_ROWS;
  const numberSymbolRows = NUMBER_SYMBOL_ROWS[currentContext];

  const handleKeyClick = (key: string) => {
    // Track frequency
    keyFrequencyTracker.recordKeyPress(key, currentContext);

    let finalKey = key;
    if (keyboardMode === 'letters' && shifted) {
      finalKey = key.toUpperCase();
      setShifted(false); // Auto-unshift after one key
    }

    if (onKeyPress) {
      onKeyPress(finalKey);
    }

    // Update heatmap
    if (showHeatmap) {
      const data = keyFrequencyTracker.getHeatmapData(currentContext);
      const map = new Map<string, number>();
      data.forEach(({ key, intensity }) => map.set(key, intensity));
      setHeatmapData(map);
    }
  };

  // Phase 1: Mobile-safe key sizing with constraints
  const getKeySize = (key: string): { width: number; height: number } => {
    let frequency = keyFrequencyTracker.getKeyFrequency(key, currentContext);

    // Demo mode: Artificially boost certain keys to show Fitts' Law
    if (demoMode) {
      const demoKeys = {
        code: ['(', ')', '{', '}', ';', '='],
        email: ['@', '.', 'a', 'e', 't'],
        chat: ['!', '?', '😊', 'a', 'l']
      };
      if (demoKeys[currentContext].includes(key)) {
        frequency = Math.max(frequency, 0.5 + Math.random() * 0.5); // 50-100% frequency
      }
    }

    // Phase 1: Use gentle Fitts' Law with MIN/MAX constraints
    // MIN_SIZE = 48px, MAX_SIZE = 90px, gentle boost (max 15%)
    const size = calculateKeySize(keyWidth, frequency);

    return size;
  };

  // Phase 1: Use context colors from config
  const getKeyColor = (key: string) => {
    const frequency = keyFrequencyTracker.getKeyFrequency(key, currentContext);
    return getKeyColorWithFrequency(currentContext, frequency);
  };

  // Phase 2: Long-press handlers
  const handleLongPressKey = (key: string, buttonElement: HTMLButtonElement) => {
    // Check if this key has alternates
    if (!hasAlternates(key, currentContext)) {
      return;
    }

    // Calculate popup position from button position
    const rect = buttonElement.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8, // 8px above the key
    });
    setPopupKey(key);
    setShowAlternatesPopup(true);
  };

  const handleSelectAlternate = (alternate: string) => {
    if (onKeyPress) {
      onKeyPress(alternate);
    }
    // Track frequency
    keyFrequencyTracker.recordKeyPress(alternate, currentContext);

    // Update heatmap
    if (showHeatmap) {
      const data = keyFrequencyTracker.getHeatmapData(currentContext);
      const map = new Map<string, number>();
      data.forEach(({ key, intensity }) => map.set(key, intensity));
      setHeatmapData(map);
    }

    setShowAlternatesPopup(false);
    setPopupKey(null);
  };

  const handleClosePopup = () => {
    setShowAlternatesPopup(false);
    setPopupKey(null);
  };

  // Phase 2: Delete word function (for swipe backspace)
  const handleDeleteWord = () => {
    // Delete from cursor to previous space/start of line
    if (onKeyPress) {
      onKeyPress('DELETE_WORD'); // Special command for parent to handle
    }
  };

  // Phase 2: Cursor movement handlers (long-press space)
  const handleCursorModeStart = () => {
    setIsCursorMode(true);
    setCursorDelta(0);
  };

  const handleCursorModeMove = (deltaX: number) => {
    if (isCursorMode) {
      // Calculate cursor movement (10px = 1 character movement)
      const charDelta = Math.floor(deltaX / 10);
      setCursorDelta(charDelta);

      // TODO: Send cursor movement command to parent
      // For now, this is just visual feedback
    }
  };

  const handleCursorModeEnd = () => {
    if (isCursorMode && cursorDelta !== 0) {
      // Apply cursor movement
      if (onKeyPress) {
        onKeyPress(`MOVE_CURSOR:${cursorDelta}`); // Special command for cursor movement
      }
    }
    setIsCursorMode(false);
    setCursorDelta(0);
  };

  // Phase 2: Compact mode - only show 3 letter rows
  const currentRows = keyboardMode === 'letters'
    ? (isCompactMode ? letterRows : letterRows) // In compact mode, only letters
    : numberSymbolRows;

  return (
    <div className="w-full bg-gray-900 rounded-lg shadow-lg"
         style={{
           width: '100%',
           maxWidth: isMobile ? '100%' : '600px',
           padding: '6px', // Balanced compact padding
           boxSizing: 'border-box'
         }}>
      {/* Mode Indicator & Compact Toggle - Phase 2 */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm text-gray-400">
          {keyboardMode === 'letters' ? (shifted ? 'UPPERCASE' : 'lowercase') : 'Numbers & Symbols'}
        </div>

        {/* Symbol Panel Button */}
        <button
          onClick={() => setIsSymbolPanelOpen(!isSymbolPanelOpen)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            isSymbolPanelOpen
              ? `text-white`
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          style={{
            backgroundColor: isSymbolPanelOpen ? CONTEXT_COLORS[currentContext].primary : undefined
          }}
          title="Open symbol panel"
        >
          #+=
        </button>

        {/* Phase 2: Compact Mode Toggle */}
        <button
          onClick={toggleCompactMode}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            isCompactMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title={isCompactMode ? 'Compact mode ON (3 rows)' : 'Compact mode OFF (full keyboard)'}
        >
          {isCompactMode ? '☰ Compact' : '⊞ Full'}
        </button>

        {!isCompactMode && (
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
              demoMode
                ? 'bg-green-500 text-white animate-pulse'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {demoMode ? '✓ Demo' : 'Demo'}
          </button>
        )}

        <div className="text-xs text-gray-500">
          {currentContext.toUpperCase()}
        </div>
      </div>

      {/* Compact Adaptive Keyboard Layout - Fixed minimum height to prevent jumping */}
      <div style={{
             display: 'flex',
             flexDirection: 'column',
             gap: `${GRID_CONFIG.GAP}px`,
             width: '100%',
             minHeight: isCompactMode ? '200px' : '350px', // Fixed min height prevents layout shift
             paddingBottom: '8px'
           }}>
        {currentRows.map((row, rowIndex) => (
          <div key={rowIndex}
               style={{
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 gap: `${GRID_CONFIG.GAP}px`,
                 width: '100%',
                 flexWrap: 'nowrap'
               }}>
            {/* Shift key on first row (letters only) */}
            {keyboardMode === 'letters' && rowIndex === 2 && (
              <button
                onClick={() => setShifted(!shifted)}
                className={`rounded-lg font-medium text-sm transition-all ${
                  shifted
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                style={{
                  width: `${keyWidth}px`,
                  height: `${keyHeight}px`,
                  flex: '0 0 auto'
                }}
              >
                {SPECIAL_KEYS.SHIFT}
              </button>
            )}

            {/* Letter/Symbol Keys - Phase 1 Grid-Based + Phase 2 Long-Press */}
            {row.map((key) => {
              const size = getKeySize(key);
              const color = getKeyColor(key);
              const freq = keyFrequencyTracker.getKeyFrequency(key, currentContext);

              // Phase 2: Create KeyButton component inline with long-press
              const KeyButton = () => {
                const buttonRef = useRef<HTMLButtonElement>(null);

                // Phase 2: Long-press hook
                const longPress = useLongPress({
                  threshold: 300,
                  onLongPress: () => {
                    if (buttonRef.current) {
                      handleLongPressKey(key, buttonRef.current);
                    }
                  },
                  onPress: () => {
                    handleKeyClick(key);
                  },
                });

                return (
                  <button
                    ref={buttonRef}
                    className="relative rounded font-semibold transition-all active:scale-95 shadow-sm"
                    style={{
                      width: `${size.width}px`,
                      height: `${size.height}px`,
                      flex: '0 0 auto', // Don't grow or shrink
                      backgroundColor: color,
                      fontSize: key.match(/[\u{1F600}-\u{1F64F}]/u) ? '20px' : '14px', // Smaller text
                      opacity: 0.8 + (freq * 0.2),
                      color: CONTEXT_COLORS[currentContext].text
                    }}
                    {...longPress.handlers}
                  >
                    <span className="font-mono">
                      {keyboardMode === 'letters' && shifted ? key.toUpperCase() : key}
                    </span>

                    {/* Frequency indicator dot */}
                    {freq > 0.05 && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    )}

                    {/* Phase 2: Alternate indicator */}
                    {hasAlternates(key, currentContext) && (
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-400">···</span>
                    )}
                  </button>
                );
              };

              return <KeyButton key={key} />;
            })}

            {/* Backspace on last row (letters only) - Phase 2: With swipe gesture */}
            {keyboardMode === 'letters' && rowIndex === 2 && (() => {
              // Phase 2: Swipe gesture for backspace
              const BackspaceButton = () => {
                const swipe = useSwipeGesture({
                  threshold: 30,
                  onSwipeLeft: handleDeleteWord,
                });

                return (
                  <button
                    onClick={() => handleKeyClick(SPECIAL_KEYS.BACKSPACE)}
                    className={`rounded-lg font-medium text-sm transition-all ${
                      swipe.isSwiping && swipe.swipeDirection === 'left'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    style={{
                      width: `${keyWidth}px`,
                      height: `${keyHeight}px`,
                      flex: '0 0 auto'
                    }}
                    {...swipe.handlers}
                  >
                    {swipe.isSwiping && swipe.swipeDirection === 'left' ? '⌫ Word' : SPECIAL_KEYS.BACKSPACE}
                  </button>
                );
              };

              return <BackspaceButton />;
            })()}
          </div>
        ))}

        {/* Bottom row: Mode switch, Space, Enter - Compact */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: `${GRID_CONFIG.GAP}px`,
          width: '100%',
          marginTop: `${GRID_CONFIG.GAP}px`
        }}>
          {/* Switch keyboard mode - Hidden in compact mode */}
          {!isCompactMode && (
            <button
              onClick={() => setKeyboardMode(keyboardMode === 'letters' ? 'numbers' : 'letters')}
              className="bg-gray-700 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-600 transition-all"
              style={{
                width: `${keyWidth * 1.2}px`,
                height: `${keyHeight}px`,
                flex: '0 0 auto'
              }}
            >
              {keyboardMode === 'letters' ? SPECIAL_KEYS.MODE_SWITCH_TO_NUM : SPECIAL_KEYS.MODE_SWITCH_TO_ABC}
            </button>
          )}

          {/* Space - Takes up most of the row - Phase 2: With long-press cursor movement */}
          {(() => {
            const SpaceButton = () => {
              const startPosRef = useRef<{ x: number; y: number } | null>(null);
              const [isDragging, setIsDragging] = useState(false);

              const longPress = useLongPress({
                threshold: 300,
                onLongPress: () => {
                  handleCursorModeStart();
                },
                onPress: () => {
                  if (!isDragging) {
                    handleKeyClick(SPECIAL_KEYS.SPACE);
                  }
                },
              });

              const handleMove = (clientX: number, clientY: number) => {
                if (isCursorMode && startPosRef.current) {
                  const deltaX = clientX - startPosRef.current.x;
                  setIsDragging(Math.abs(deltaX) > 5);
                  handleCursorModeMove(deltaX);
                }
              };

              const customHandlers = {
                onMouseDown: (e: React.MouseEvent) => {
                  startPosRef.current = { x: e.clientX, y: e.clientY };
                  longPress.handlers.onMouseDown(e);
                },
                onMouseMove: (e: React.MouseEvent) => {
                  handleMove(e.clientX, e.clientY);
                },
                onMouseUp: (e: React.MouseEvent) => {
                  handleCursorModeEnd();
                  longPress.handlers.onMouseUp(e);
                  startPosRef.current = null;
                  setIsDragging(false);
                },
                onMouseLeave: (e: React.MouseEvent) => {
                  handleCursorModeEnd();
                  longPress.handlers.onMouseLeave(e);
                  startPosRef.current = null;
                  setIsDragging(false);
                },
                onTouchStart: (e: React.TouchEvent) => {
                  const touch = e.touches[0];
                  startPosRef.current = { x: touch.clientX, y: touch.clientY };
                  longPress.handlers.onTouchStart(e);
                },
                onTouchMove: (e: React.TouchEvent) => {
                  const touch = e.touches[0];
                  handleMove(touch.clientX, touch.clientY);
                  longPress.handlers.onTouchMove(e);
                },
                onTouchEnd: (e: React.TouchEvent) => {
                  handleCursorModeEnd();
                  longPress.handlers.onTouchEnd(e);
                  startPosRef.current = null;
                  setIsDragging(false);
                },
              };

              return (
                <button
                  className={`rounded-lg font-medium transition-all ${
                    isCursorMode
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                  style={{
                    flex: '1 1 auto',
                    height: `${keyHeight}px`,
                    minWidth: `${keyWidth * 2}px`
                  }}
                  {...customHandlers}
                >
                  {isCursorMode ? (
                    <span>
                      ← {cursorDelta < 0 ? Math.abs(cursorDelta) : ''}
                      {cursorDelta === 0 ? 'Move Cursor' : ''}
                      {cursorDelta > 0 ? cursorDelta : ''} →
                    </span>
                  ) : (
                    'Space'
                  )}
                </button>
              );
            };

            return <SpaceButton />;
          })()}

          {/* Enter */}
          <button
            onClick={() => handleKeyClick(SPECIAL_KEYS.ENTER)}
            className="bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-all"
            style={{
              width: `${keyWidth * 1.2}px`,
              height: `${keyHeight}px`,
              flex: '0 0 auto'
            }}
          >
            {SPECIAL_KEYS.ENTER}
          </button>
        </div>
      </div>

      {/* Compact Adaptive Mode Info */}
      {!isCompactMode && (
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500">
            📱 Adaptive: {viewportWidth}px → {columns} cols × {Math.round(keyWidth)}px keys
          </div>
        </div>
      )}

      {/* Phase 2: Alternate Keys Popup */}
      {showAlternatesPopup && popupKey && (
        <AlternateKeysPopup
          alternates={getAlternatesForKey(popupKey, currentContext) || []}
          onSelect={handleSelectAlternate}
          onClose={handleClosePopup}
          position={popupPosition}
          baseKey={popupKey}
        />
      )}

      {/* Context-Specific Symbol Panel */}
      <SymbolPanel
        context={currentContext}
        isOpen={isSymbolPanelOpen}
        onClose={() => setIsSymbolPanelOpen(false)}
        onSymbolSelect={(symbol) => {
          if (onKeyPress) {
            onKeyPress(symbol);
          }
          // Track symbol usage
          keyFrequencyTracker.recordKeyPress(symbol, currentContext);
        }}
      />
    </div>
  );
};

export default MobileKeyboard;
