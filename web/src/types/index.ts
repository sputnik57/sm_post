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

    // ========== NEW: Cultural Sensitivity Fields (MVP) ==========
    clientCommunities?: string[]; // e.g., ["bipoc", "lgbtqia", "trauma-survivors"]
    clientCommunitiesCustom?: string; // Free text for communities not in predefined list
    coreValues?: string[]; // e.g., ["racial-justice", "trauma-informed"]
    contentToAvoid?: string[]; // e.g., ["toxic-positivity", "hustle-culture"]


    // ========== RESERVED: Future Cultural Fields (Phase 2+) ==========
    // Language & Identity
    languagePreference?: 'person-first' | 'identity-first' | 'contextual' | 'community-led';
    pronounUsage?: 'they-them' | 'mixed' | 'custom';
    traumaLanguage?: 'survivor' | 'experiencer' | 'contextual';

    // Systems & Context
    explicitSystemsDiscussion?: boolean; // Acknowledge racism, ableism, etc.
    intersectionalityAwareness?: boolean;

    // Content Safety
    contentWarningsEnabled?: boolean;
    contentWarningTopics?: string[]; // e.g., ["trauma", "eating-disorders"]

    // Faith & Spirituality
    faithIntegration?: 'explicit' | 'spiritual' | 'secular';
    faithTradition?: string; // e.g., "Christian", "Buddhist", "Non-denominational"

    // Accessibility
    multilingualSupport?: string[]; // e.g., ["es", "zh"]
    accessibilityPriority?: boolean; // Plain language, alt text reminders, etc.

    // Detailed Demographics (Phase 2+) - SIMPLIFIED FOR RESPECTFUL UX
    detailedCommunities?: {
        bipoc?: {
            culturalContext?: string; // Free text, user-defined
        };
        lgbtqia?: {
            focus?: string; // Free text, user-defined
        };
        immigration?: {
            context?: string; // Free text
        };
        neurodivergent?: {
            context?: string; // Free text
        };
        trauma?: {
            context?: string; // Free text
        };
        chronicIllness?: {
            context?: string; // Free text
        };
    };

    // Lived Experience (Phase 2+)
    practitionerLivedExperience?: 'shared' | 'partial' | 'ally';
    practitionerIdentities?: string[]; // Self-disclosed for "we" vs "you" language
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

    // ========== NEW: Cultural Context for This Specific Content ==========
    culturalContext?: {
        specificHoliday?: string; // e.g., "Día de los Muertos"
        currentEvents?: string; // e.g., "Pride Month", "Mental Health Awareness Week"
        communityStressors?: string; // e.g., "Election anxiety", "Pandemic trauma"
        seasonalContext?: string; // e.g., "Back to school", "Holiday family dynamics"
    };

    // Who is this content FOR specifically?
    specificAudience?: string; // e.g., "Black women navigating workplace microaggressions"

    // Practitioner's relationship to topic
    livedExperienceWithTopic?: 'shared' | 'partial' | 'ally';
}

export interface GenerationStyle {
    formality: number; // 0-1
    energy: number; // 0-1
    humor: number; // 0-1
    sentiment: 'positive' | 'neutral' | 'urgent';

    // ========== NEW: Cultural Tone Adjustments ==========
    systemsAcknowledgment?: 'explicit' | 'implicit' | 'none'; // Mention racism, etc.
    collectiveVsIndividual?: 'collective' | 'balanced' | 'individual'; // "We" vs "You"
    validationLevel?: 'high' | 'medium' | 'low'; // How much to affirm/normalize
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
    altText?: string; // Accessibility
}

export interface GeneratedContent {
    id: string;
    platform: SocialPlatform;
    content: string;
    imageUrls?: string[];
    status: 'pending' | 'completed' | 'failed';

    // ========== NEW: Cultural Audit Metadata ==========
    culturalAudit?: {
        communitiesReferenced: string[];
        systemsAcknowledged: string[];
        avoidedHarmfulContent: string[];
        languagePreferenceUsed: string;
    };
}

// ========== NEW: Type Guards & Helpers ==========

export const CLIENT_COMMUNITIES = [
    'bipoc',
    'lgbtqia',
    'immigrants',
    'neurodivergent',
    'trauma-survivors',
    'chronic-illness',
    'low-income',
    'veterans',
    'general'
] as const;

export const CORE_VALUES = [
    'cultural-humility',
    'racial-justice',
    'trauma-informed',
    'body-liberation',
    'accessibility',
    'social-justice',
    'gender-affirming',
    'harm-reduction',
    'collective-care',
    'decolonizing'
] as const;

export const CONTENT_TO_AVOID = [
    'toxic-positivity',
    'hustle-culture',
    'diet-culture',
    'colorblind',
    'savior-complex',
    'inspiration-porn',
    'pathologizing',
    'individualism',
    'trauma-dumping'
] as const;

export type ClientCommunity = typeof CLIENT_COMMUNITIES[number];
export type CoreValue = typeof CORE_VALUES[number];
export type ContentAvoidance = typeof CONTENT_TO_AVOID[number];

// Helper function to check if cultural fields are populated
export function hasCulturalContext(profile: BrandProfile): boolean {
    return !!(
        profile.clientCommunities?.length ||
        profile.coreValues?.length ||
        profile.contentToAvoid?.length
    );
}

// Helper to generate prompt metadata
export function getCulturalPromptContext(profile: BrandProfile): string {
    const parts: string[] = [];

    if (profile.clientCommunities?.length) {
        parts.push(`Communities served: ${profile.clientCommunities.join(', ')}`);
    }

    if (profile.coreValues?.length) {
        parts.push(`Core values: ${profile.coreValues.join(', ')}`);
    }

    if (profile.contentToAvoid?.length) {
        parts.push(`Avoid: ${profile.contentToAvoid.join(', ')}`);
    }

    return parts.join('\n');
}