import { getSupabase } from '@/lib/supabase';
const supabase = getSupabase();
import { BrandProfile } from '@/types';

// NOTE: In a real app with RLS, these should be called server-side or with a session.
// For the prototype, we assume public/anon usage or simple implementation.

export const fetchBrandProfile = async (id: string): Promise<BrandProfile | null> => {
    const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching brand profile:', error);
        return null;
    }

    return data as BrandProfile;
};

export const saveBrandProfile = async (profile: BrandProfile) => {
    // Explicitly map camelCase to snake_case for Supabase
    const dbProfile = {
        id: profile.id,
        name: profile.name,
        voice_descriptors: profile.voiceDescriptors,
        forbidden_words: profile.forbiddenWords,
        reading_level: profile.readingLevel,
        emoji_policy: profile.emojiPolicy,
        hashtag_policy: profile.hashtagPolicy,
        tone_guidelines: profile.toneGuidelines,
        sample_captions: profile.sampleCaptions,
        colors: profile.colors,
        logo_url: profile.logoUrl,
        visual_dos_and_donts: profile.visualDosAndDonts,
        competitors: profile.competitors,
        target_platforms: profile.targetPlatforms,
    };

    const { data, error } = await supabase
        .from('brand_profiles')
        .upsert(dbProfile)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// n8n connection helpers would go here (server-side mostly)
export const triggerCopyGeneration = async (payload: any) => {
    // This calls our Next.js API route, not n8n directly
    const res = await fetch('/api/generate/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Generation failed');
    return res.json();
};
