"use client";
import React, { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Asset } from '@/types';

export default function Step4Assets() {
    const { setStep, addAsset, removeAsset, assets } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            Array.from(e.target.files).forEach((file) => {
                // In a real app, we'd upload to Supabase storage here
                // For now, we creating a local object URL to preview
                const asset: Asset = {
                    id: crypto.randomUUID(),
                    file,
                    previewUrl: URL.createObjectURL(file), // Note: this needs cleanup in real app
                    type: file.type.startsWith('video') ? 'video' : 'image'
                };
                addAsset(asset);
            });
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach((file) => {
                const asset: Asset = {
                    id: crypto.randomUUID(),
                    file,
                    previewUrl: URL.createObjectURL(file),
                    type: file.type.startsWith('video') ? 'video' : 'image'
                };
                addAsset(asset);
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-brand-red">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Upload Assets</CardTitle>
                <CardDescription>
                    Provide images or logos to guide the visual generation.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Dropzone */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-6 w-6 text-brand-red" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                        <p className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </div>

                {/* Asset List */}
                {assets.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {assets.map((asset) => (
                            <div key={asset.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                {asset.type === 'image' ? (
                                    <img
                                        src={asset.previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}

                                {/* Overlay remove button */}
                                <button
                                    onClick={() => removeAsset(asset.id)}
                                    className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Options (Mock) */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold">Image Preferences</h4>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                            Use Brand Colors
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" className="rounded border-gray-300 text-brand-red focus:ring-brand-red" defaultChecked />
                            Enhance Quality
                        </label>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg">
                <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={() => setStep(5)} className="bg-brand-red hover:bg-brand-red/90 text-white min-w-[120px]">
                    Next Step
                </Button>
            </CardFooter>
        </Card>
    );
}
