/**
 * Context-Specific Symbol Panel
 * Slides up from bottom to show context-appropriate symbols
 */

import React, { useEffect } from 'react';
import type { ContextType } from '../types';
import { getSymbolPanel, type SymbolButton } from '../config/symbolPanels';

interface SymbolPanelProps {
  context: ContextType;
  isOpen: boolean;
  onClose: () => void;
  onSymbolSelect: (symbol: string) => void;
}

const SymbolPanel: React.FC<SymbolPanelProps> = ({
  context,
  isOpen,
  onClose,
  onSymbolSelect,
}) => {
  const config = getSymbolPanel(context);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle symbol click
  const handleSymbolClick = (symbol: string) => {
    onSymbolSelect(symbol);
    // Auto-close after selection
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'bg-opacity-30' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: '60vh',
          borderTop: `4px solid ${config.color}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3
              className="text-lg font-semibold"
              style={{ color: config.color }}
            >
              {config.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Close symbol panel"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Symbol Grid */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(60vh - 80px)' }}>
          <div className="space-y-3">
            {config.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-wrap gap-2 justify-center"
              >
                {row.symbols.map((symbolBtn, symbolIndex) => (
                  <SymbolButtonComponent
                    key={symbolIndex}
                    symbolBtn={symbolBtn}
                    contextColor={config.color}
                    onClick={() => handleSymbolClick(symbolBtn.symbol)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Swipe-down indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
      </div>
    </>
  );
};

/**
 * Individual symbol button component
 */
interface SymbolButtonComponentProps {
  symbolBtn: SymbolButton;
  contextColor: string;
  onClick: () => void;
}

const SymbolButtonComponent: React.FC<SymbolButtonComponentProps> = ({
  symbolBtn,
  contextColor,
  onClick,
}) => {
  const { symbol, label, size = 'medium' } = symbolBtn;

  // Size configurations
  const sizeClasses = {
    small: 'w-12 h-12 text-sm',
    medium: 'w-14 h-14 text-base',
    large: 'w-16 h-16 text-2xl',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-xl
        font-medium
        transition-all duration-150
        active:scale-95
        shadow-sm
        hover:shadow-md
      `}
      style={{
        backgroundColor: `${contextColor}10`,
        border: `2px solid ${contextColor}30`,
        color: contextColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${contextColor}20`;
        e.currentTarget.style.borderColor = contextColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${contextColor}10`;
        e.currentTarget.style.borderColor = `${contextColor}30`;
      }}
      aria-label={`Insert ${label || symbol}`}
    >
      <span className="select-none">{label || symbol}</span>
    </button>
  );
};

export default SymbolPanel;
