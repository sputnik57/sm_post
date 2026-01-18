export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook';

export interface BrandProfile {
    id: string; // UUID
    name: string;
    voiceDescriptors: string[]; // e.g., ["professional", "witty"]
    forbiddenWords: string[];
    readingLevel: 'grade5' | 'grade8' | 'college';
    emojiPolicy: 'none' | 'light' | 'heavy';
    hashtagPolicy: 'none' | 'light' | 'heavy';
    toneGuidelines: string; // Free text
    sampleCaptions: string[];
    colors: {
        primary: string; // Hex
        secondary: string;
        accent?: string;
    };
    logoUrl?: string;
    visualDosAndDonts?: string;
    competitors?: string[];
    targetPlatforms: SocialPlatform[];
}

export interface ContentBrief {
    campaignName: string;
    keyMessage: string;
    audience: string;
    goal: string;
    cta: string;
    platforms: SocialPlatform[];
    requirements: {
        length?: Record<SocialPlatform, number>;
        mentionBrandedHashtags?: boolean;
    };
}

export interface GenerationStyle {
    formality: number; // 0-1
    energy: number; // 0-1
    humor: number; // 0-1
    sentiment: 'positive' | 'neutral' | 'urgent';
}

export interface Job {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    etaSec?: number;
    outputs?: any; // Flexible for now, will refine
    error?: string;
}

export interface Asset {
    id: string;
    file: File;
    previewUrl: string;
    type: 'image' | 'video';
}

export interface GeneratedContent {
    id: string;
    platform: SocialPlatform;
    content: string;
    imageUrls?: string[];
    status: 'pending' | 'completed' | 'failed';
}
