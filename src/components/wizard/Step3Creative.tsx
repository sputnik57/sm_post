"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store/useAppStore';
import { GenerationStyle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function Step3Creative() {
    const { setStep, updateStyle, style } = useAppStore();

    const { register, handleSubmit, watch, setValue } = useForm<GenerationStyle>({
        defaultValues: style || {
            formality: 0.5,
            energy: 0.5,
            humor: 0.5,
            sentiment: 'positive'
        }
    });

    const formality = watch('formality');
    const energy = watch('energy');
    const humor = watch('humor');

    const onSubmit = (data: GenerationStyle) => {
        console.log('Submitting Style:', data);
        updateStyle(data);
        setStep(4); // Move to Assets
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-brand-red">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Creative Controls</CardTitle>
                <CardDescription>
                    Fine-tune the tone and energy of your content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="style-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Sliders */}
                    <div className="space-y-6">

                        {/* Formality */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Label>Formality</Label>
                                <span className="text-brand-red">
                                    {formality < 0.3 ? 'Casual' : formality > 0.7 ? 'Formal' : 'Neutral'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                                {...register('formality', { valueAsNumber: true })}
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Casual</span>
                                <span>Formal</span>
                            </div>
                        </div>

                        {/* Energy */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Label>Energy</Label>
                                <span className="text-brand-red">
                                    {energy < 0.3 ? 'Calm' : energy > 0.7 ? 'High Hype' : 'Balanced'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                                {...register('energy', { valueAsNumber: true })}
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Calm</span>
                                <span>High Energy</span>
                            </div>
                        </div>

                        {/* Humor */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <Label>Humor</Label>
                                <span className="text-brand-red">
                                    {(humor || 0) < 0.3 ? 'Serious' : (humor || 0) > 0.7 ? 'Funny' : 'Subtle'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                                {...register('humor', { valueAsNumber: true })}
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Serious</span>
                                <span>Meme-worthy</span>
                            </div>
                        </div>

                    </div>

                    {/* Sentiment */}
                    <div className="space-y-3">
                        <Label>Sentiment</Label>
                        <div className="flex gap-4">
                            {['positive', 'neutral', 'urgent'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value={s}
                                        {...register('sentiment')}
                                        className="text-brand-red focus:ring-brand-red"
                                    />
                                    <span className="capitalize text-sm">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" form="style-form" className="bg-brand-red hover:bg-brand-red/90 text-white min-w-[120px]">
                    Next Step
                </Button>
            </CardFooter>
        </Card>
    );
}
