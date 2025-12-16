/**
 * useSwipeGesture Hook
 * Detects swipe gestures on touch and mouse events
 * Phase 2: Mobile UX gestures
 */

import { useCallback, useRef, useState } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeOptions {
  threshold?: number; // px to trigger swipe (default 30px)
  onSwipe?: (direction: SwipeDirection) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeResult {
  isSwiping: boolean;
  swipeDirection: SwipeDirection | null;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

/**
 * Hook to detect swipe gestures
 * Works with both touch and mouse events
 */
export function useSwipeGesture(options: SwipeOptions): SwipeResult {
  const {
    threshold = 30, // 30px minimum swipe distance
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const currentPos = useRef<{ x: number; y: number } | null>(null);

  const getDirection = useCallback(
    (deltaX: number, deltaY: number): SwipeDirection | null => {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if movement is large enough
      if (absX < threshold && absY < threshold) {
        return null;
      }

      // Determine primary direction (horizontal or vertical)
      if (absX > absY) {
        // Horizontal swipe
        return deltaX > 0 ? 'right' : 'left';
      } else {
        // Vertical swipe
        return deltaY > 0 ? 'down' : 'up';
      }
    },
    [threshold]
  );

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      onSwipe?.(direction);

      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    },
    [onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  const start = useCallback((x: number, y: number) => {
    startPos.current = { x, y };
    currentPos.current = { x, y };
    setIsSwiping(true);
    setSwipeDirection(null);
  }, []);

  const move = useCallback(
    (x: number, y: number) => {
      if (!startPos.current) return;

      currentPos.current = { x, y };
      const deltaX = x - startPos.current.x;
      const deltaY = y - startPos.current.y;

      const direction = getDirection(deltaX, deltaY);
      if (direction) {
        setSwipeDirection(direction);
      }
    },
    [getDirection]
  );

  const end = useCallback(() => {
    if (!startPos.current || !currentPos.current) {
      setIsSwiping(false);
      setSwipeDirection(null);
      return;
    }

    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;

    const direction = getDirection(deltaX, deltaY);
    if (direction) {
      handleSwipe(direction);
    }

    startPos.current = null;
    currentPos.current = null;
    setIsSwiping(false);
    setSwipeDirection(null);
  }, [getDirection, handleSwipe]);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      start(e.clientX, e.clientY);
    },
    [start]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (startPos.current) {
        move(e.clientX, e.clientY);
      }
    },
    [move]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      end();
    },
    [end]
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      start(touch.clientX, touch.clientY);
    },
    [start]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startPos.current) {
        const touch = e.touches[0];
        move(touch.clientX, touch.clientY);
      }
    },
    [move]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      end();
    },
    [end]
  );

  return {
    isSwiping,
    swipeDirection,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
