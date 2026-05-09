import { create } from 'zustand';

interface LeadFormState {
  step: number;
  type: 'Nigeria' | 'UK' | null;
  data: Record<string, any>;
  setStep: (step: number) => void;
  setType: (type: 'Nigeria' | 'UK') => void;
  updateData: (newData: Record<string, any>) => void;
  reset: () => void;
}

export const useLeadStore = create<LeadFormState>((set) => ({
  step: 1,
  type: null,
  data: {},
  setStep: (step) => set({ step }),
  setType: (type) => set({ type }),
  updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
  reset: () => set({ step: 1, type: null, data: {} }),
}));
