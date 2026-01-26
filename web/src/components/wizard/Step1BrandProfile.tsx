"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/useAppStore';
import { BrandProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2 } from 'lucide-react';
import { saveBrandProfile } from '@/lib/api';

export default function Step1BrandProfile() {
    const { setStep, setBrandProfile, brandProfile } = useAppStore();
    const [isSaving, setIsSaving] = React.useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<BrandProfile>({
        defaultValues: brandProfile || {
            name: '',
            voiceDescriptors: [''],
            toneGuidelines: '',
            colors: { primary: '#DF2521', secondary: '#000000' },
            emojiPolicy: 'light',
            hashtagPolicy: 'light',
            readingLevel: 'grade8',
            // NEW: Cultural sensitivity fields
            clientCommunities: [],
            clientCommunitiesCustom: '',
            coreValues: [],
            contentToAvoid: []
        }
    });

    // Watch which communities are selected for progressive disclosure
    const selectedCommunities = watch('clientCommunities', []);

    const onSubmit = async (data: BrandProfile) => {
        setIsSaving(true);
        try {
            console.log('═══════════════════════════════════════');
            console.log('📝 [FORM] Starting Brand Profile Submission');
            console.log('═══════════════════════════════════════');
            console.log('🔍 [FORM] RAW FORM DATA:', data);
            console.log('🔍 [FORM] Client Communities:', data.clientCommunities, 'Type:', typeof data.clientCommunities);
            console.log('🔍 [FORM] Core Values:', data.coreValues, 'Type:', typeof data.coreValues);
            console.log('🔍 [FORM] Content to Avoid:', data.contentToAvoid, 'Type:', typeof data.contentToAvoid);

            const profileWithId = {
                ...data,
                id: data.id || crypto.randomUUID(),
                voiceDescriptors: typeof data.voiceDescriptors === 'string'
                    ? (data.voiceDescriptors as string).split(',').map((s: string) => s.trim()).filter((s: string) => s)
                    : data.voiceDescriptors,
                // NEW: Process cultural fields
                clientCommunities: Array.isArray(data.clientCommunities) ? data.clientCommunities : [],
                coreValues: Array.isArray(data.coreValues) ? data.coreValues : [],
                contentToAvoid: Array.isArray(data.contentToAvoid) ? data.contentToAvoid : [],
                forbiddenWords: Array.isArray(data.forbiddenWords) ? data.forbiddenWords : [],
                sampleCaptions: Array.isArray(data.sampleCaptions) ? data.sampleCaptions : [],
                competitors: Array.isArray(data.competitors) ? data.competitors : [],
                targetPlatforms: Array.isArray(data.targetPlatforms) ? data.targetPlatforms : []
            };

            console.log('✨ [FORM] Profile with ID and processed arrays:', profileWithId);
            console.log('✨ [FORM] Cultural fields after processing:', {
                clientCommunities: profileWithId.clientCommunities,
                coreValues: profileWithId.coreValues,
                contentToAvoid: profileWithId.contentToAvoid
            });

            await saveBrandProfile(profileWithId);
            console.log('✅ [FORM] Successfully saved, moving to step 2');
            setBrandProfile(profileWithId);
            setStep(2);
        } catch (error) {
            console.error('❌ [FORM] Failed to save brand profile:', error);
            const profileWithId = {
                ...data,
                id: data.id || crypto.randomUUID()
            };
            setBrandProfile(profileWithId);
            setStep(2);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-brand-red">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    Define Your Brand Voice & Community
                </CardTitle>
                <CardDescription>
                    Tell us about your practice and who you serve. This helps us create culturally-sensitive, authentic content.
                </CardDescription>
                {brandProfile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Brand profile loaded from saved data
                        </p>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* ========== SECTION 1: Basic Brand Info ========== */}
                    <div className="space-y-4 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="name">Brand/Practice Name *</Label>
                            <Input
                                id="name"
                                placeholder="Your practice or business name"
                                {...register('name', { required: 'Brand name is required' })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="voiceDescriptors">Voice Descriptors (comma separated)</Label>
                            <Input
                                id="voiceDescriptors"
                                placeholder="e.g., Warm, Direct, Compassionate, Professional"
                                {...register('voiceDescriptors')}
                            />
                            <p className="text-xs text-gray-500">How would you describe your communication style?</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="toneGuidelines">Tone Guidelines</Label>
                            <Textarea
                                id="toneGuidelines"
                                placeholder="e.g., Always validating, never preachy. Acknowledge systemic issues, not just individual solutions."
                                className="min-h-[100px]"
                                {...register('toneGuidelines')}
                            />
                            <p className="text-xs text-gray-500">Any specific guidelines for how you communicate?</p>
                        </div>
                    </div>

                    {/* ========== SECTION 2: Cultural Context (NEW!) ========== */}
                    <div className="space-y-4 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-foreground">Who You Serve</h3>
                        <p className="text-sm text-gray-600">Help us understand your community to create relevant, respectful content.</p>

                        <div className="space-y-2">
                            <Label htmlFor="clientCommunities">Client Communities *</Label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="bipoc" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">BIPOC communities</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="lgbtqia" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">LGBTQIA+ individuals</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="immigrants" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">Immigrants & refugees</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="neurodivergent" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">Neurodivergent individuals</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="trauma-survivors" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">Trauma survivors</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="chronic-illness" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">Chronic illness/disability community</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="general" {...register('clientCommunities')} className="rounded border-gray-300" />
                                    <span className="text-sm">General population</span>
                                </label>
                            </div>

                            {/* NEW: Custom community input */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <Label htmlFor="clientCommunitiesCustom" className="text-sm">Other communities not listed?</Label>
                                <Input
                                    id="clientCommunitiesCustom"
                                    placeholder="e.g., First responders, Healthcare workers, Military families"
                                    className="mt-1"
                                    {...register('clientCommunitiesCustom')}
                                />
                                <p className="text-xs text-gray-500 mt-1">We'll incorporate this into your content voice.</p>
                            </div>

                            <p className="text-xs text-gray-500">Select all that apply. This helps us use culturally-appropriate language.</p>
                        </div>

                        {/* ========== PROGRESSIVE DISCLOSURE SECTIONS ========== */}

                        {/* Progressive Disclosure: BIPOC Communities */}
                        {selectedCommunities?.includes('bipoc') && (
                            <div className="ml-6 mt-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-blue-900">
                                    More about BIPOC communities (optional)
                                </Label>

                                <p className="text-xs text-blue-700">
                                    Help us understand the specific communities you serve so we can use culturally-appropriate language.
                                </p>

                                <div className="text-xs text-blue-600 space-y-1 pl-3 border-l-2 border-blue-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-blue-600/80">
                                        <li>Black/African American</li>
                                        <li>Latinx/Hispanic/Latiné</li>
                                        <li>Asian/Pacific Islander</li>
                                        <li>Indigenous/Native American</li>
                                        <li>Middle Eastern/North African (MENA)</li>
                                        <li>Multiracial</li>
                                        <li>Other identities</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="bipocContext" className="text-sm text-blue-900">
                                        Describe the specific communities you serve:
                                    </Label>
                                    <Textarea
                                        id="bipocContext"
                                        placeholder='e.g., "Primarily Afro-Latinx community, many 2nd-generation immigrants" or "Black women navigating corporate environments"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.bipoc.culturalContext')}
                                    />
                                    <p className="text-xs text-blue-600 mt-1">
                                        Use your own words - we'll incorporate this nuance into your content.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Progressive Disclosure: LGBTQIA+ */}
                        {selectedCommunities?.includes('lgbtqia') && (
                            <div className="ml-6 mt-3 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-purple-900">
                                    More about LGBTQIA+ focus (optional)
                                </Label>

                                <p className="text-xs text-purple-700">
                                    Helps us use appropriate terminology and avoid assumptions.
                                </p>

                                <div className="text-xs text-purple-600 space-y-1 pl-3 border-l-2 border-purple-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-purple-600/80">
                                        <li>Trans/transgender individuals</li>
                                        <li>Nonbinary/gender diverse folks</li>
                                        <li>Queer community</li>
                                        <li>Gay/lesbian individuals</li>
                                        <li>Asexual/aromantic spectrum</li>
                                        <li>Gender-affirming care focus</li>
                                        <li>Two-Spirit individuals</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="lgbtqiaContext" className="text-sm text-purple-900">
                                        Describe your focus:
                                    </Label>
                                    <Textarea
                                        id="lgbtqiaContext"
                                        placeholder='e.g., "Specializing in gender-affirming care for trans and nonbinary youth" or "Queer-affirming therapy for BIPOC LGBTQIA+ individuals"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.lgbtqia.focus')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Progressive Disclosure: Neurodivergent */}
                        {selectedCommunities?.includes('neurodivergent') && (
                            <div className="ml-6 mt-3 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg space-y-3 animate-in fade-in-slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-green-900">
                                    Neurodivergent specifics (optional)
                                </Label>

                                <p className="text-xs text-green-700">
                                    Helps us use identity-first or person-first language appropriately.
                                </p>

                                <div className="text-xs text-green-600 space-y-1 pl-3 border-l-2 border-green-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-green-600/80">
                                        <li>ADHD</li>
                                        <li>Autistic/Autism spectrum</li>
                                        <li>Learning differences</li>
                                        <li>Dyslexia/Dyscalculia</li>
                                        <li>Multiple neurodivergences</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="neurodivergentContext" className="text-sm text-green-900">
                                        What should we know?
                                    </Label>
                                    <Textarea
                                        id="neurodivergentContext"
                                        placeholder='e.g., "Primarily ADHD adults, late-diagnosed" or "Autistic individuals and their families, identity-first language preferred"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.neurodivergent.context')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Progressive Disclosure: Immigrants */}
                        {selectedCommunities?.includes('immigrants') && (
                            <div className="ml-6 mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-yellow-900">
                                    Immigration context (optional)
                                </Label>

                                <p className="text-xs text-yellow-700">
                                    Understanding generational context and specific challenges helps us create relevant content.
                                </p>

                                <div className="text-xs text-yellow-600 space-y-1 pl-3 border-l-2 border-yellow-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-yellow-600/80">
                                        <li>First generation (born outside US)</li>
                                        <li>1.5 generation (immigrated as child)</li>
                                        <li>Second generation (US-born, immigrant parents)</li>
                                        <li>Refugees/asylum seekers</li>
                                        <li>Undocumented community</li>
                                        <li>Specific regions (e.g., Central American, Southeast Asian)</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="immigrationContext" className="text-sm text-yellow-900">
                                        Describe the communities:
                                    </Label>
                                    <Textarea
                                        id="immigrationContext"
                                        placeholder='e.g., "Central American families, primarily 1st generation, many undocumented" or "Southeast Asian refugees and their 2nd gen children"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.immigration.context')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Progressive Disclosure: Trauma Survivors */}
                        {selectedCommunities?.includes('trauma-survivors') && (
                            <div className="ml-6 mt-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-red-900">
                                    Trauma specifics (optional)
                                </Label>

                                <p className="text-xs text-red-700">
                                    This helps us avoid potentially triggering language and use trauma-informed framing.
                                </p>

                                <div className="text-xs text-red-600 space-y-1 pl-3 border-l-2 border-red-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-red-600/80">
                                        <li>Sexual violence survivors</li>
                                        <li>Domestic violence survivors</li>
                                        <li>War/combat trauma</li>
                                        <li>Medical trauma</li>
                                        <li>Religious trauma</li>
                                        <li>Childhood trauma/Complex PTSD</li>
                                        <li>Intergenerational trauma</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="traumaContext" className="text-sm text-red-900">
                                        What should we know?
                                    </Label>
                                    <Textarea
                                        id="traumaContext"
                                        placeholder='e.g., "Sexual assault survivors, primarily college-age women" or "Complex PTSD from childhood abuse, adult survivors" or "Religious trauma, ex-evangelical community"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.trauma.context')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Progressive Disclosure: Chronic Illness/Disability */}
                        {selectedCommunities?.includes('chronic-illness') && (
                            <div className="ml-6 mt-3 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Label className="text-sm font-semibold text-indigo-900">
                                    Chronic illness/Disability focus (optional)
                                </Label>

                                <p className="text-xs text-indigo-700">
                                    Helps us avoid ableist language and use appropriate terminology.
                                </p>

                                <div className="text-xs text-indigo-600 space-y-1 pl-3 border-l-2 border-indigo-300">
                                    <p className="font-medium">Examples might include:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-indigo-600/80">
                                        <li>Chronic pain/illness</li>
                                        <li>Disability community</li>
                                        <li>Autoimmune conditions</li>
                                        <li>Mental illness/Mad pride</li>
                                        <li>Deaf/Hard of hearing</li>
                                        <li>Blind/Low vision</li>
                                    </ul>
                                </div>

                                <div>
                                    <Label htmlFor="chronicIllnessContext" className="text-sm text-indigo-900">
                                        What should we know?
                                    </Label>
                                    <Textarea
                                        id="chronicIllnessContext"
                                        placeholder='e.g., "Chronic pain warriors, spoonie community" or "Disability justice focus, anti-ableism" or "Deaf community, ASL-fluent practice"'
                                        className="mt-2 text-sm bg-white"
                                        rows={3}
                                        {...register('detailedCommunities.chronicIllness.context')}
                                    />
                                </div>
                            </div>
                        )}


                        <div className="space-y-2">
                            <Label htmlFor="coreValues">Core Values (select up to 3) *</Label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="cultural-humility" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Cultural humility</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="racial-justice" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Racial justice & anti-racism</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="trauma-informed" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Trauma-informed care</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="body-liberation" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Body liberation/anti-diet culture</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="accessibility" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Accessibility & affordability</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="social-justice" {...register('coreValues')} className="rounded border-gray-300" />
                                    <span className="text-sm">Social justice orientation</span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">What principles guide your practice?</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contentToAvoid">Content to Avoid</Label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="toxic-positivity" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">Toxic positivity ("just think positive!")</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="hustle-culture" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">Hustle culture messaging</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="diet-culture" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">Weight loss/diet content</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="colorblind" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">Color-blind approach to race</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="pathologizing" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">Pathologizing language</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" value="individualism" {...register('contentToAvoid')} className="rounded border-gray-300" />
                                    <span className="text-sm">"Pull yourself up" individualism</span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">Help us avoid harmful messaging in your content.</p>
                        </div>
                    </div>

                    {/* ========== SECTION 3: Style Preferences ========== */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Style Preferences</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="readingLevel">Reading Level</Label>
                                <select
                                    id="readingLevel"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                                    {...register('readingLevel')}
                                >
                                    <option value="grade5">Grade 5 (Simple)</option>
                                    <option value="grade8">Grade 8 (Standard)</option>
                                    <option value="college">College (Technical)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emojiPolicy">Emoji Usage</Label>
                                <select
                                    id="emojiPolicy"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                                    {...register('emojiPolicy')}
                                >
                                    <option value="none">None 🚫</option>
                                    <option value="light">Light ✨</option>
                                    <option value="heavy">Heavy 🚀🔥</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hashtagPolicy">Hashtag Usage</Label>
                                <select
                                    id="hashtagPolicy"
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                                    {...register('hashtagPolicy')}
                                >
                                    <option value="none">None</option>
                                    <option value="light">Light (2-3)</option>
                                    <option value="heavy">Heavy (5+)</option>
                                </select>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="space-y-2">
                            <Label>Brand Colors (Optional)</Label>
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="primaryColor" className="text-xs">Primary</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            id="primaryColor"
                                            className="w-12 h-10 p-1"
                                            {...register('colors.primary')}
                                        />
                                        <Input
                                            type="text"
                                            {...register('colors.primary')}
                                            placeholder="#DF2521"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="secondaryColor" className="text-xs">Secondary</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            id="secondaryColor"
                                            className="w-12 h-10 p-1"
                                            {...register('colors.secondary')}
                                        />
                                        <Input
                                            type="text"
                                            {...register('colors.secondary')}
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" disabled>Back</Button>
                <Button
                    type="submit"
                    form="brand-form"
                    disabled={isSaving}
                    className="bg-brand-red hover:bg-brand-red-dark text-white min-w-[120px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Next: Content Brief'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}