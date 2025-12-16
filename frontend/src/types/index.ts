// Context types
export type ContextType = 'code' | 'email' | 'chat';

// Keyboard layout types
export interface KeyConfig {
  key_id: string;
  character: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  frequency_rank: number;
  color: string;
  haptic?: boolean;
}

export interface KeyRow {
  row_id: number;
  keys: KeyConfig[];
}

export interface SpecialButton {
  button_id: string;
  label: string;
  action: string;
  position: { x: number; y: number };
}

export interface KeyboardLayout {
  mode: ContextType;
  version: string;
  theme: string;
  layout: {
    rows: KeyRow[];
  };
  special_buttons?: SpecialButton[];
}

// Context detection types
export interface ContextDetectionResult {
  context: ContextType;
  confidence: number;
  timestamp: string;
  detection_id: string;
  alternative_contexts: Array<{
    context: string;
    confidence: number;
  }>;
}

// Metrics types
export interface PerformanceMetrics {
  wpm: number;
  error_rate: number;
  total_keystrokes: number;
  duration_seconds: number;
  context_distribution: {
    code: number;
    email: number;
    chat: number;
  };
}

export interface KeystrokeEvent {
  session_id: string;
  timestamp: string;
  key: string;
  context_mode: ContextType;
  is_error: boolean;
  key_duration?: number;
}

// Session types
export interface Session {
  session_id: string;
  user_id: string;
  start_time: string;
  keyboard_type: 'adaptive' | 'static';
}
