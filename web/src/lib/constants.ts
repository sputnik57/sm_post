import { BrandProfile } from '@/types';

export const TEKNOCULTURE_PROFILE: BrandProfile = {
    id: 'teknoculture-seed',
    name: 'teKnoculture',
    voiceDescriptors: ['Professional', 'Innovative', 'Bold', 'Clean'],
    forbiddenWords: ['cheap', 'easy', 'guarantee'],
    readingLevel: 'grade8',
    emojiPolicy: 'light',
    hashtagPolicy: 'light',
    toneGuidelines: 'Use a confident, concise tone. Focus on technology and culture intersection. Avoid jargon where possible, but remain authoritative.',
    sampleCaptions: [
        "Redefining the digital landscape. 🔴 #teKnoculture",
        "Where innovation meets identity. The future is here.",
        "Elevate your perspective. Join the movement."
    ],
    colors: {
        primary: '#DF2521', // Brand Red
        secondary: '#000000', // Black
        accent: '#FFEFE8' // Pink-1
    },
    visualDosAndDonts: 'Logo must always have a lowercase "t" and capital red "K". Use high-contrast imagery. Avoid clutter.',
    competitors: [],
    targetPlatforms: ['linkedin', 'twitter', 'instagram']
};
