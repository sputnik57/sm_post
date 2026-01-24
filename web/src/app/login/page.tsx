"use client";
import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, Mail } from 'lucide-react';

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
            const supabase = getSupabase();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-brand-red">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">SocialPost AI</CardTitle>
                    <CardDescription>
                        Sign in to generate on-brand content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded bg-red-50 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red/90" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Magic Link
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
