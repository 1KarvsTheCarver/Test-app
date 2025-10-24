import { create } from 'zustand';
import { StruggleType, FaithPath, AnchorVerse, Goal } from '../types';

interface OnboardingState {
  struggle: StruggleType | '';
  faithPath: FaithPath | '';
  anchorVerse: AnchorVerse | null;
  goal: Goal | null;

  setStruggle: (struggle: StruggleType) => void;
  setFaithPath: (path: FaithPath) => void;
  setAnchorVerse: (verse: AnchorVerse) => void;
  setGoal: (goal: Goal) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  struggle: '',
  faithPath: '',
  anchorVerse: null,
  goal: null,

  setStruggle: (struggle) => set({ struggle }),
  setFaithPath: (faithPath) => set({ faithPath }),
  setAnchorVerse: (anchorVerse) => set({ anchorVerse }),
  setGoal: (goal) => set({ goal }),
  reset: () =>
    set({
      struggle: '',
      faithPath: '',
      anchorVerse: null,
      goal: null,
    }),
}));
