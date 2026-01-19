import { create } from 'zustand';
import { BrandProfile, ContentBrief, GenerationStyle, Asset, GeneratedContent } from '@/types';

interface AppState {
    currentStep: number;
    selectedBrandId: string | null;
    brandProfile: BrandProfile | null;
    brief: ContentBrief;
    style: GenerationStyle;
    assets: Asset[];
    generatedContent: GeneratedContent[];

    // Actions
    setStep: (step: number) => void;
    setBrandId: (id: string) => void;
    setBrandProfile: (profile: BrandProfile) => void;
    updateBrief: (brief: Partial<ContentBrief>) => void;
    updateStyle: (style: Partial<GenerationStyle>) => void;
    addAsset: (asset: Asset) => void;
    removeAsset: (id: string) => void;
    setGeneratedContent: (content: GeneratedContent[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentStep: 1,
    selectedBrandId: null,
    brandProfile: null,
    brief: {
        campaignName: '',
        keyMessage: '',
        audience: '',
        goal: '',
        cta: '',
        platforms: [],
        requirements: {}
    },
    style: {
        formality: 0.5,
        energy: 0.5,
        humor: 0.0,
        sentiment: 'positive'
    },
    assets: [],
    generatedContent: [],

    setStep: (step) => set({ currentStep: step }),
    setBrandId: (id) => set({ selectedBrandId: id }),
    setBrandProfile: (profile) => set({ brandProfile: profile }),
    updateBrief: (updates) => set((state) => ({ brief: { ...state.brief, ...updates } })),
    updateStyle: (updates) => set((state) => ({ style: { ...state.style, ...updates } })),
    addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
    removeAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),
    setGeneratedContent: (content) => set({ generatedContent: content }),
}));
