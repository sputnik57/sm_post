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

    // Initialize form with existing data if available
    const { register, handleSubmit, formState: { errors } } = useForm<BrandProfile>({
        defaultValues: brandProfile || {
            name: '',
            voiceDescriptors: [''],
            toneGuidelines: '',
            colors: { primary: '#DF2521', secondary: '#000000' },
            emojiPolicy: 'light',
            hashtagPolicy: 'light',
            readingLevel: 'grade8'
        }
    });

    const onSubmit = async (data: BrandProfile) => {
        setIsSaving(true);
        try {
            console.log('Saving Brand Profile:', data);
            // Ensure ID exists and convert comma-separated strings to arrays
            const profileWithId = {
                ...data,
                id: data.id || crypto.randomUUID(),
                voiceDescriptors: typeof data.voiceDescriptors === 'string'
                    ? (data.voiceDescriptors as string).split(',').map((s: string) => s.trim()).filter((s: string) => s)
                    : data.voiceDescriptors,
                forbiddenWords: Array.isArray(data.forbiddenWords) ? data.forbiddenWords : [],
                sampleCaptions: Array.isArray(data.sampleCaptions) ? data.sampleCaptions : [],
                competitors: Array.isArray(data.competitors) ? data.competitors : [],
                targetPlatforms: Array.isArray(data.targetPlatforms) ? data.targetPlatforms : []
            };

            // Save to Supabase
            await saveBrandProfile(profileWithId);

            // Update local state
            setBrandProfile(profileWithId);
            setStep(2);
        } catch (error) {
            console.error('Failed to save brand profile:', error);
            // Still update local state as fallback
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
                    Establish Your Brand Identity in Text
                </CardTitle>
                <CardDescription>
                    Define how your brand speaks and looks. This profile will guide the AI to stay on-brand.
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
                <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Brand Name</Label>
                            <Input
                                id="name"
                                placeholder="Acme Corp"
                                {...register('name', { required: 'Brand name is required' })}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="voiceDescriptors">Voice Descriptors (comma separated)</Label>
                            <Input
                                id="voiceDescriptors"
                                placeholder="Professional, Witty, Direct"
                                {...register('voiceDescriptors')} // TODO: Convert string to array
                            />
                            <p className="text-xs text-gray-400">Keywords that describe your personality.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="toneGuidelines">Tone Guidelines</Label>
                            <Textarea
                                id="toneGuidelines"
                                placeholder="e.g. Always be helpful, never use slang, focus on value."
                                className="min-h-[100px]"
                                {...register('toneGuidelines')}
                            />
                        </div>
                    </div>

                    {/* Constraints */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="readingLevel">Reading Level</Label>
                            <select
                                id="readingLevel"
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...register('hashtagPolicy')}
                            >
                                <option value="none">None #🚫</option>
                                <option value="light">Light #✨</option>
                                <option value="heavy">Heavy #🚀#🔥</option>
                            </select>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                        <Label>Brand Colors</Label>
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

                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" disabled>Back</Button>
                <Button type="submit" form="brand-form" disabled={isSaving} className="bg-brand-red hover:bg-brand-red/90 text-white min-w-[120px]">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Next Step'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
