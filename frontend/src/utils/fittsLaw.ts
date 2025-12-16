/**
 * Fitts' Law Calculations for Optimal Keyboard Layout
 *
 * Fitts' Law: MT = a + b * log₂(D/W + 1)
 * where:
 *   MT = Movement Time
 *   a, b = empirically determined constants
 *   D = Distance to target
 *   W = Width of target
 */

export interface Point {
  x: number;
  y: number;
}

export interface KeySize {
  width: number;
  height: number;
}

export interface FittsParams {
  a: number; // Intercept constant (typically 0-100ms)
  b: number; // Slope constant (typically 100-200ms)
}

// Default Fitts' Law parameters (from empirical studies)
const DEFAULT_FITTS_PARAMS: FittsParams = {
  a: 50,   // 50ms base time
  b: 150   // 150ms per bit of difficulty
};

/**
 * Calculate movement time using Fitts' Law
 */
export function calculateMovementTime(
  distance: number,
  targetWidth: number,
  params: FittsParams = DEFAULT_FITTS_PARAMS
): number {
  if (distance <= 0 || targetWidth <= 0) return params.a;

  // MT = a + b * log₂(D/W + 1)
  const indexOfDifficulty = Math.log2(distance / targetWidth + 1);
  return params.a + params.b * indexOfDifficulty;
}

/**
 * Calculate Euclidean distance between two points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate optimal key size based on usage frequency
 * More frequent keys should be larger and closer to home position
 */
export function calculateOptimalKeySize(
  frequency: number,
  minSize: number = 40,
  maxSize: number = 80
): KeySize {
  // Frequency is normalized 0-1
  const normalizedFreq = Math.max(0, Math.min(1, frequency));

  // Linear interpolation between min and max size
  const size = minSize + (maxSize - minSize) * normalizedFreq;

  return {
    width: Math.round(size),
    height: Math.round(size)
  };
}

/**
 * Calculate Index of Difficulty (ID) for a target
 * ID = log₂(D/W + 1)
 */
export function calculateIndexOfDifficulty(
  distance: number,
  targetWidth: number
): number {
  if (targetWidth <= 0) return Infinity;
  return Math.log2(distance / targetWidth + 1);
}

/**
 * Calculate throughput (bits per second)
 * TP = ID / MT
 */
export function calculateThroughput(
  distance: number,
  targetWidth: number,
  movementTime: number
): number {
  if (movementTime <= 0) return 0;
  const id = calculateIndexOfDifficulty(distance, targetWidth);
  return id / (movementTime / 1000); // Convert ms to seconds
}

/**
 * Home row position (center of keyboard)
 */
export const HOME_POSITION: Point = {
  x: 400, // Center X
  y: 200  // Middle row Y
};

/**
 * Calculate optimal position for a key based on frequency
 * More frequent keys should be closer to home position
 */
export function calculateOptimalPosition(
  frequency: number,
  basePosition: Point,
  homePosition: Point = HOME_POSITION,
  maxDisplacement: number = 200
): Point {
  // Frequency is normalized 0-1
  const normalizedFreq = Math.max(0, Math.min(1, frequency));

  // Less frequent keys can be further from home
  const allowedDistance = maxDisplacement * (1 - normalizedFreq);

  // Calculate direction from home to base position
  const dx = basePosition.x - homePosition.x;
  const dy = basePosition.y - homePosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return homePosition;

  // Scale to allowed distance
  const scale = Math.min(allowedDistance / distance, 1);

  return {
    x: homePosition.x + dx * scale,
    y: homePosition.y + dy * scale
  };
}

/**
 * Calculate effective width considering 2D pointing
 * Uses Shannon formulation for 2D targets
 */
export function calculateEffectiveWidth(size: KeySize): number {
  // For square/rectangular targets, use smaller dimension
  return Math.min(size.width, size.height);
}

/**
 * Optimize entire layout using Fitts' Law
 */
export interface KeyConfig {
  id: string;
  character: string;
  frequency: number;
  basePosition: Point;
}

export interface OptimizedKey extends KeyConfig {
  position: Point;
  size: KeySize;
  movementTime: number;
  indexOfDifficulty: number;
}

export function optimizeLayout(
  keys: KeyConfig[],
  homePosition: Point = HOME_POSITION,
  params: FittsParams = DEFAULT_FITTS_PARAMS
): OptimizedKey[] {
  return keys.map(key => {
    // Calculate optimal size based on frequency
    const size = calculateOptimalKeySize(key.frequency);

    // Calculate optimal position based on frequency
    const position = calculateOptimalPosition(
      key.frequency,
      key.basePosition,
      homePosition
    );

    // Calculate distance from home position
    const distance = calculateDistance(homePosition, position);

    // Calculate effective width
    const effectiveWidth = calculateEffectiveWidth(size);

    // Calculate movement time and difficulty
    const movementTime = calculateMovementTime(distance, effectiveWidth, params);
    const indexOfDifficulty = calculateIndexOfDifficulty(distance, effectiveWidth);

    return {
      ...key,
      position,
      size,
      movementTime,
      indexOfDifficulty
    };
  });
}

/**
 * Calculate average movement time for a layout
 */
export function calculateAverageMovementTime(
  optimizedKeys: OptimizedKey[]
): number {
  if (optimizedKeys.length === 0) return 0;

  const totalTime = optimizedKeys.reduce(
    (sum, key) => sum + key.movementTime * key.frequency,
    0
  );

  const totalFrequency = optimizedKeys.reduce(
    (sum, key) => sum + key.frequency,
    0
  );

  return totalFrequency > 0 ? totalTime / totalFrequency : 0;
}

/**
 * Grid-based layout generator
 * Arranges keys in a grid while respecting Fitts' Law
 */
export function generateGridLayout(
  keys: OptimizedKey[],
  columns: number = 10,
  spacing: number = 5
): OptimizedKey[] {
  // Sort keys by frequency (most frequent first)
  const sortedKeys = [...keys].sort((a, b) => b.frequency - a.frequency);

  // Arrange in grid centered around home position
  return sortedKeys.map((key, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    // Center the grid
    const gridWidth = columns * (key.size.width + spacing);
    const startX = HOME_POSITION.x - gridWidth / 2;

    const x = startX + col * (key.size.width + spacing);
    const y = HOME_POSITION.y - 100 + row * (key.size.height + spacing);

    return {
      ...key,
      position: { x, y }
    };
  });
}

/**
 * Zone-based layout (QWERTY-like zones)
 */
export const KEYBOARD_ZONES = {
  LEFT_PINKY: { x: 100, y: 200, label: 'Left Pinky' },
  LEFT_RING: { x: 150, y: 195, label: 'Left Ring' },
  LEFT_MIDDLE: { x: 200, y: 190, label: 'Left Middle' },
  LEFT_INDEX: { x: 250, y: 195, label: 'Left Index' },
  LEFT_THUMB: { x: 300, y: 250, label: 'Left Thumb' },
  RIGHT_THUMB: { x: 500, y: 250, label: 'Right Thumb' },
  RIGHT_INDEX: { x: 550, y: 195, label: 'Right Index' },
  RIGHT_MIDDLE: { x: 600, y: 190, label: 'Right Middle' },
  RIGHT_RING: { x: 650, y: 195, label: 'Right Ring' },
  RIGHT_PINKY: { x: 700, y: 200, label: 'Right Pinky' }
};

/**
 * Assign keys to zones based on traditional finger positions
 */
export function assignToZones(keys: OptimizedKey[]): Map<string, OptimizedKey[]> {
  const zoneAssignments = new Map<string, OptimizedKey[]>();

  Object.entries(KEYBOARD_ZONES).forEach(([zoneName]) => {
    zoneAssignments.set(zoneName, []);
  });

  // Assign each key to nearest zone
  keys.forEach(key => {
    let nearestZone = 'LEFT_INDEX';
    let minDistance = Infinity;

    Object.entries(KEYBOARD_ZONES).forEach(([zoneName, zonePos]) => {
      const dist = calculateDistance(key.position, zonePos);
      if (dist < minDistance) {
        minDistance = dist;
        nearestZone = zoneName;
      }
    });

    zoneAssignments.get(nearestZone)?.push(key);
  });

  return zoneAssignments;
}
