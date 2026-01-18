"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/useAppStore';
import { ContentBrief, SocialPlatform } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

const PLATFORMS: { id: SocialPlatform; label: string }[] = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'tiktok', label: 'TikTok' },
];

export default function Step2Brief() {
    const { setStep, updateBrief, brief } = useAppStore();

    // Initialize form with existing data
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ContentBrief>({
        defaultValues: brief || {
            campaignName: '',
            keyMessage: '',
            audience: '',
            goal: '',
            cta: '',
            platforms: [],
            requirements: {}
        }
    });

    const selectedPlatforms = watch('platforms') || [];

    const handlePlatformToggle = (platformId: SocialPlatform) => {
        const current = selectedPlatforms;
        if (current.includes(platformId)) {
            setValue('platforms', current.filter(p => p !== platformId));
        } else {
            setValue('platforms', [...current, platformId]);
        }
    };

    const onSubmit = (data: ContentBrief) => {
        console.log('Submitting Brief:', data);
        updateBrief(data);
        setStep(3);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-brand-red">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Content Brief</CardTitle>
                <CardDescription>
                    What are we posting? Define the core message and target.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="brief-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="campaignName">Campaign Name</Label>
                            <Input
                                id="campaignName"
                                placeholder="Q1 Product Launch"
                                {...register('campaignName', { required: 'Campaign name is required' })}
                            />
                            {errors.campaignName && <p className="text-sm text-red-500">{errors.campaignName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keyMessage">Key Message</Label>
                            <Textarea
                                id="keyMessage"
                                placeholder="The new widget is 2x faster and saves you money."
                                {...register('keyMessage', { required: 'Key message is required' })}
                            />
                            {errors.keyMessage && <p className="text-sm text-red-500">{errors.keyMessage.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="audience">Target Audience</Label>
                                <Input
                                    id="audience"
                                    placeholder="Small business owners"
                                    {...register('audience')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goal">Goal</Label>
                                <Input
                                    id="goal"
                                    placeholder="Drive signups, Awareness"
                                    {...register('goal')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cta">Call to Action (CTA)</Label>
                            <Input
                                id="cta"
                                placeholder="Click link in bio"
                                {...register('cta')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Target Platforms</Label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map((platform) => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => handlePlatformToggle(platform.id)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                                            ${selectedPlatforms.includes(platform.id)
                                                ? 'bg-brand-red text-white border-brand-red'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {platform.label}
                                    </button>
                                ))}
                            </div>
                            {/* Hidden input to register platform in form if needed, or we rely on setValue */}
                        </div>

                    </div>

                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" form="brief-form" className="bg-brand-red hover:bg-brand-red/90 text-white min-w-[120px]">
                    Next Step
                </Button>
            </CardFooter>
        </Card>
    );
}
