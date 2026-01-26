"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, Mail } from 'lucide-react';
import WizardStepper from '@/components/wizard/WizardStepper';
import { Lock } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md shadow-lg text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle>Check your inbox</CardTitle>
                        <CardDescription>
                            We've sent a magic link to <strong>{email}</strong>.
                            <br />Click the link to sign in.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center text-sm text-gray-500">
                        <Button variant="ghost" onClick={() => setIsSent(false)}>Back to Login</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 gap-12">

            {/* Header Content - Now at the Top */}
            <div className="text-center space-y-6 max-w-2xl">


                <h1 className="text-5xl font-bold text-black">
                    A week of 
                    <span className="text-[#DF2521]"> Authentic Social Content </span>
                    in Under
                    <span className="text-[#DF2521]"> 10 Minutes.</span>
                </h1>

                <p className="text-lg text-gray-700">
                    Connect with the right clients through culturally sensitive content 
                    that reflects your values and sounds like you.
                </p>
            </div>

            {/* Process Section */}
            <div className="w-full max-w-5xl mx-auto px-4 mb-16">
                {/* Add introduction */}
                <div className="text-center mb-10">
                    <h2 className="text-xl md:text-2xl font-semibold text-black mb-3">
                        Built for Intentional Content Creation
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                        Not a template generator. A guided process asking details about 
                        both yours and client community's values.
                    </p>
                </div>

                {/* Stepper Preview */}
                <div className="w-full max-w-4xl mx-auto hidden md:block opacity-100 hover:opacity-100 transition-all duration-500">
                    <WizardStepper currentStep={1} />
                </div>

                {/* Add intelligence signal */}
                <p className="text-center text-xs text-gray-500 mt-8 italic max-w-3xl mx-auto hidden md:block">
                    Our approach considers intersectionality, trauma-informed language, 
                    and community-specific terminology—because one-size-fits-all content 
                    doesn't serve marginalized communities.
                </p>

            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-brand-red bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-8 px-6">
                    <CardTitle className="text-2xl font-bold mb-4">
                        Get Started
                    </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    We respect your privacy. No spam, ever.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 text-lg"
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded bg-red-50 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        <Button className="bg-brand-red hover:bg-brand-red-dark text-white">
                            Send My Sign-in Link
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            <span className="font-medium text-gray-700">What happens next:</span>
                            <br />
                            Check your email · Click the link · Start creating
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
