"use client";
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
  
export const STEPS = [
    { id: 1, title: 'Brand Profile', description: 'Define your voice & client community' },
    { id: 2, title: 'Content Brief', description: 'Set topic & cultural context' },
    { id: 3, title: 'Creative Controls', description: 'Adjust tone, language & sensitivity' },
    { id: 4, title: 'Assets', description: 'Add your visuals (optional)' },
    { id: 5, title: 'Generate', description: 'Review, edit & export your week' },
];
  
interface WizardStepperProps {
    currentStep: number;
}
  
export default function WizardStepper({ currentStep }: WizardStepperProps) {
    return (
        <div className="relative w-full max-w-5xl mx-auto">
            {/* Progress line */}
            <div className="absolute top-5 left-1 right-1 h-0.5 bg-[#EEC7C7] -z-10" />
            
            <div className="flex justify-between">
                {STEPS.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    const isFuture = step.id > currentStep;
  
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            {/* Circle indicator */}
                            <div
                                className={`
                                    flex h-10 w-10 items-center justify-center rounded-full border-2
                                    transition-all duration-300
                                    ${isCompleted ? 'border-[#DA9894] bg-[#DA9894]' : ''}
                                    ${isCurrent ? 'border-[#DF2521] bg-white scale-110' : ''}
                                    ${isFuture ? 'border-[#EEC7C7] bg-white opacity-60' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                ) : (
                                    <span className={`
                                        font-semibold text-sm
                                        ${isCurrent ? 'text-[#DF2521]' : ''}
                                        ${isFuture ? 'text-gray-400' : ''}
                                    `}>
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            
                            {/* Labels */}
                            <div className="text-center hidden sm:block">
                                <p className={`
                                    text-sm font-medium transition-colors duration-300
                                    ${isCompleted ? 'text-[#DA9894]' : ''}
                                    ${isCurrent ? 'text-[#DF2521]' : ''}
                                    ${isFuture ? 'text-gray-500 opacity-60' : ''}
                                `}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}