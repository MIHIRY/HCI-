/**
 * AlternateKeysPopup Component
 * Phase 2: Shows alternate characters on long-press
 */

import React from 'react';

interface AlternateKeysPopupProps {
  alternates: string[];
  onSelect: (alternate: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
  baseKey: string;
}

const AlternateKeysPopup: React.FC<AlternateKeysPopupProps> = ({
  alternates,
  onSelect,
  onClose,
  position,
  baseKey,
}) => {
  if (alternates.length === 0) return null;

  const handleSelect = (alternate: string) => {
    onSelect(alternate);
    onClose();
  };

  return (
    <>
      {/* Backdrop to catch clicks outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onTouchEnd={onClose}
      />

      {/* Popup menu */}
      <div
        className="fixed z-50 bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-600 p-1"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -100%)', // Center horizontally, position above
          minWidth: '200px',
        }}
      >
        {/* Arrow pointing down to the key */}
        <div
          className="absolute left-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"
          style={{
            transform: 'translateX(-50%)',
          }}
        />

        {/* Base key (highlighted) */}
        <div className="flex flex-wrap gap-1 items-center justify-center">
          <button
            onClick={() => handleSelect(baseKey)}
            className="bg-blue-500 text-white font-bold rounded px-3 py-2 hover:bg-blue-600 transition-colors text-base"
          >
            {baseKey}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600 mx-1" />

          {/* Alternate keys */}
          {alternates.map((alt, index) => (
            <button
              key={index}
              onClick={() => handleSelect(alt)}
              className="bg-gray-700 text-gray-200 font-semibold rounded px-3 py-2 hover:bg-gray-600 transition-colors text-base whitespace-nowrap"
            >
              {alt}
            </button>
          ))}
        </div>

        {/* Hint text */}
        <div className="text-xs text-gray-400 text-center mt-1">
          Tap to select
        </div>
      </div>
    </>
  );
};

export default AlternateKeysPopup;
