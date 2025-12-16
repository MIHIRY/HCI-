import { create } from 'zustand';
import type { ContextType, KeyboardLayout, PerformanceMetrics } from '../types/index';

interface AppState {
  // Context state
  currentContext: ContextType;
  contextConfidence: number;
  previousContext: ContextType | null;

  // Input state
  inputText: string;

  // Keyboard state
  currentLayout: KeyboardLayout | null;
  isCompactMode: boolean; // Phase 2: Compact mode toggle

  // Session state
  sessionId: string | null;
  userId: string | null;

  // Metrics state
  metrics: PerformanceMetrics | null;
  totalKeystrokes: number;
  startTime: number | null;

  // Actions
  setContext: (context: ContextType, confidence: number) => void;
  setInputText: (text: string) => void;
  setLayout: (layout: KeyboardLayout) => void;
  setSession: (sessionId: string, userId: string) => void;
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  incrementKeystrokes: () => void;
  startSession: () => void;
  toggleCompactMode: () => void; // Phase 2: Toggle compact mode
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentContext: 'code',
  contextConfidence: 1.0,
  previousContext: null,
  inputText: '',
  currentLayout: null,
  isCompactMode: false, // Phase 2: Start in full mode
  sessionId: null,
  userId: null,
  metrics: null,
  totalKeystrokes: 0,
  startTime: null,

  // Actions
  setContext: (context, confidence) =>
    set((state) => ({
      currentContext: context,
      contextConfidence: confidence,
      previousContext: state.currentContext
    })),

  setInputText: (text) => set({ inputText: text }),

  setLayout: (layout) => set({ currentLayout: layout }),

  setSession: (sessionId, userId) => set({ sessionId, userId }),

  updateMetrics: (newMetrics) =>
    set((state) => ({
      metrics: state.metrics
        ? { ...state.metrics, ...newMetrics }
        : (newMetrics as PerformanceMetrics)
    })),

  incrementKeystrokes: () =>
    set((state) => ({
      totalKeystrokes: state.totalKeystrokes + 1
    })),

  startSession: () => set({ startTime: Date.now() }),

  // Phase 2: Toggle compact mode
  toggleCompactMode: () => set((state) => ({
    isCompactMode: !state.isCompactMode
  })),

  reset: () => set({
    currentContext: 'code',
    contextConfidence: 1.0,
    previousContext: null,
    inputText: '',
    currentLayout: null,
    isCompactMode: false,
    sessionId: null,
    userId: null,
    metrics: null,
    totalKeystrokes: 0,
    startTime: null
  })
}));
