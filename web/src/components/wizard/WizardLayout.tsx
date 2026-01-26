"use client";
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

import Step1BrandProfile from './Step1BrandProfile';
import Step2Brief from './Step2Brief';
import Step3Creative from './Step3Creative';
import Step4Assets from './Step4Assets';
import Step5Generate from './Step5Generate';

import WizardStepper from './WizardStepper';

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
            <WizardStepper currentStep={currentStep} />

            {/* Step Content */}
            <div className="min-h-[400px]">
                {renderStep()}
            </div>
        </div>
    );
}
