"use client";
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GeneratedContent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, RefreshCw, Copy, Download, Share2 } from 'lucide-react';

import { triggerCopyGeneration } from '@/lib/api';

export default function Step5Generate() {
    const { setStep, brief, style, brandProfile, assets, generatedContent, setGeneratedContent } = useAppStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

    // Simulate generation on mount if empty
    useEffect(() => {
        if (generatedContent.length === 0 && !isGenerating) {
            // Optional: Auto-generate on entry? Maybe better to wait for user action in this prototype.
            // handleGenerate(); 
        }
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const payload = {
                brandProfile,
                brief,
                style,
                platforms: brief.platforms.length > 0 ? brief.platforms : ['instagram', 'linkedin']
            };

            const result = await triggerCopyGeneration(payload);
            console.log('📥 [STEP5] Generation Result:', result);

            // Parsing the n8n/LLM response - handles different model formats
            // OpenAI: { message: { content: "..." } }
            // Claude/OpenRouter: { text: "..." }
            // Anthropic: { content: [{ text: "..." }] }
            let contentText = "No content returned";

            if (typeof result === 'string') contentText = result;
            else if (result.message?.content) contentText = result.message.content; // OpenAI
            else if (result.text) contentText = result.text; // Claude/OpenRouter
            else if (result.content) {
                // Handle Anthropic format: [{ text: "..." }]
                if (Array.isArray(result.content) && result.content[0]?.text) {
                    contentText = result.content[0].text;
                } else {
                    contentText = result.content; // Direct content
                }
            }
            else if (result.output) contentText = result.output; // common n8n key
            else if (result.choices && result.choices[0]) contentText = result.choices[0].message?.content || "";
            else contentText = JSON.stringify(result, null, 2); // Fallback debug view

            console.log('📄 [STEP5] Full LLM Response:', contentText);

            // NEW: Parse platform-specific sections from the LLM response
            const parsedContent = parsePlatformContent(contentText, payload.platforms);
            console.log('✂️ [STEP5] Parsed Platform Content:', parsedContent);

            setGeneratedContent(parsedContent);

        } catch (error) {
            console.error("❌ [STEP5] Generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * Parse platform-specific content from LLM response
     * Expected format from Claude:
     * 
     * **1. POST 1: [Topic]**
     * 
     * **Instagram version:**
     * [content]
     * ---
     * **LinkedIn version:**
     * [content]
     * ---
     */
    const parsePlatformContent = (fullText: string, platforms: string[]): GeneratedContent[] => {
        const platformContent: { [key: string]: string[] } = {};

        // Initialize arrays for each platform
        platforms.forEach(platform => {
            platformContent[platform] = [];
        });

        // Split by post numbers to get individual posts
        const postSections = fullText.split(/\*\*\d+\.\s+POST\s+\d+:/i);

        // Process each post section
        postSections.forEach((section, index) => {
            if (!section.trim()) return; // Skip empty sections

            // Extract post title if present
            const titleMatch = section.match(/^([^*\n]+)/);
            const postTitle = titleMatch ? titleMatch[1].trim().replace(/\*\*$/, '') : '';

            // Try to parse platform-specific content within this post
            platforms.forEach(platform => {
                const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

                // Match various formats:
                // **Instagram version:**
                // === INSTAGRAM ===
                // Instagram:
                const patterns = [
                    new RegExp(`\\*\\*${platformName} version:\\*\\*([\\s\\S]*?)(?=\\*\\*\\w+\\s+version:|---|$)`, 'i'),
                    new RegExp(`===\\s*${platformName.toUpperCase()}\\s*===([\\s\\S]*?)(?====|---|$)`, 'i'),
                    new RegExp(`${platformName}:([\\s\\S]*?)(?=\\w+:|---|$)`, 'i')
                ];

                for (const pattern of patterns) {
                    const match = section.match(pattern);
                    if (match) {
                        let content = match[1].trim().replace(/^-+$/gm, '').trim();

                        // Prepend post title if we have one
                        if (postTitle && index > 0) { // index > 0 because first split is before "POST 1"
                            content = `**POST ${index}: ${postTitle}**\n\n${content}`;
                        }

                        platformContent[platform].push(content);
                        break; // Found match, stop trying other patterns
                    }
                }
            });
        });

        console.log('🔍 [PARSE] Platform content extracted:', platformContent);

        // If parsing failed, fall back to showing the full text for all platforms
        const anyPlatformHasContent = Object.values(platformContent).some(arr => arr.length > 0);

        if (!anyPlatformHasContent) {
            console.warn('⚠️ [PARSE] Could not parse platform-specific content, using full text for all platforms');
            // Split by post numbers (1., 2., 3.) as fallback
            const postMatches = [...fullText.matchAll(/\d+\.\s+([\s\S]*?)(?=\d+\.\s+|$)/g)];
            const fallbackPosts = postMatches.map(match => match[1].trim()).filter(p => p.length > 0);

            return platforms.map(platform => ({
                id: crypto.randomUUID(),
                platform: platform as any,
                status: 'completed' as const,
                content: fallbackPosts.length > 0 ? fallbackPosts.join('\n\n---\n\n') : fullText,
                imageUrls: assets.length > 0 ? [assets[0].previewUrl] : []
            }));
        }

        // Build GeneratedContent array with parsed platform-specific content
        return platforms.map(platform => {
            const posts = platformContent[platform];
            const combinedContent = posts.length > 0
                ? posts.join('\n\n━━━━━━━━━━━━━━━━\n\n') // Visual separator between posts
                : 'No content generated for this platform.';

            return {
                id: crypto.randomUUID(),
                platform: platform as any,
                status: 'completed' as const,
                content: combinedContent,
                imageUrls: assets.length > 0 ? [assets[0].previewUrl] : []
            };
        });
    };

    if (isGenerating) {
        return (
            <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-brand-red">
                <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <Loader2 className="h-12 w-12 text-brand-red animate-spin" />
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">Generating Magic...</h3>
                        <p className="text-gray-500">Refining copy and polishing pixels.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg border-t-4 border-brand-red">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold">Review Generated Content</CardTitle>
                    <CardDescription>Ready for review and export.</CardDescription>
                </div>
                <Button onClick={handleGenerate} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate All
                </Button>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedContent.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                            {/* Header */}
                            <div className="px-4 py-3 bg-gray-50 border-b">
                                <span className="font-semibold capitalize text-sm">
                                    {item.platform}
                                </span>
                            </div>

                            {/* Image Preview */}
                            <div className="aspect-video bg-gray-100 relative">
                                {item.imageUrls?.[0] && (
                                    <img src={item.imageUrls[0]} className="w-full h-full object-cover" />
                                )}
                            </div>

                            {/* Copy content */}
                            <div className="p-4 flex-1">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.content}</p>
                            </div>

                            {/* Actions */}
                            <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
                                <Button
                                    variant={copiedItems.has(item.id) ? "secondary" : "outline"}
                                    size="sm"
                                    className="gap-1 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.content);
                                        setCopiedItems(prev => new Set(prev).add(item.id));
                                        setTimeout(() => {
                                            setCopiedItems(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(item.id);
                                                return newSet;
                                            });
                                        }, 2000); // Reset after 2 seconds
                                    }}
                                >
                                    <Copy className="h-3 w-3" /> {copiedItems.has(item.id) ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => {
                                        const element = document.createElement('a');
                                        const file = new Blob([item.content], { type: 'text/plain' });
                                        element.href = URL.createObjectURL(file);
                                        element.download = `${item.platform}-post.txt`;
                                        document.body.appendChild(element);
                                        element.click();
                                        document.body.removeChild(element);
                                    }}
                                >
                                    <Download className="h-3 w-3" /> Save
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" onClick={() => setStep(4)}>Back to Assets</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[120px] gap-2">
                    <Share2 className="h-4 w-4" />
                    Approve & Schedule
                </Button>
            </CardFooter>
        </Card>
    );
}
