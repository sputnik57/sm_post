"use client";
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import Step1BrandProfile from './Step1BrandProfile';
import Step2Brief from './Step2Brief';
import Step3Creative from './Step3Creative';
import Step4Assets from './Step4Assets';
import Step5Generate from './Step5Generate';

const STEPS = [
    { id: 1, title: 'Brand Profile', description: 'Define your voice & style' },
    { id: 2, title: 'Content Brief', description: 'What are we posting?' },
    { id: 3, title: 'Creative Controls', description: 'Fine-tune the output' },
    { id: 4, title: 'Assets', description: 'Upload images' },
    { id: 5, title: 'Generate', description: 'Review & export' },
];

export default function WizardLayout() {
    const { currentStep } = useAppStore();

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1BrandProfile />;
            case 2:
                return <Step2Brief />;
            case 3:
                return <Step3Creative />;
            case 4:
                return <Step4Assets />;
            case 5:
                return <Step5Generate />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Progress Stepper */}
            <div className="relative">
                <div className="absolute top-5 left-1 right-1 h-0.5 bg-gray-200 -z-10" />
                <div className="flex justify-between">
                    {STEPS.map((step) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div
                                    className={`
                                        flex h-10 w-10 items-center justify-center rounded-full border-2 
                                        transition-colors duration-300
                                        ${isCompleted || isCurrent ? 'border-brand-red bg-white' : 'border-gray-200 bg-white'}
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-brand-red" />
                                    ) : (
                                        <span className={`font-semibold ${isCurrent ? 'text-brand-red' : 'text-gray-400'}`}>
                                            {step.id}
                                        </span>
                                    )}
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className={`text-sm font-medium ${isCurrent ? 'text-brand-red' : 'text-gray-500'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {renderStep()}
            </div>
        </div>
    );
}
