"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function PhotoChange() {
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string>('');

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverError, setCoverError] = useState<string>('');

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfileError('');

        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setProfileError('Photo must be JPEG or PNG');
            return;
        }

        // Validate file size (4 MB)
        if (file.size > 4 * 1024 * 1024) {
            setProfileError('File size must be under 4 MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCoverError('');

        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setCoverError('Photo must be JPEG or PNG');
            return;
        }

        // Validate file size (6 MB)
        if (file.size > 6 * 1024 * 1024) {
            setCoverError('File size must be under 6 MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveProfile = () => {
        setProfilePreview(null);
        setProfileError('');
        const input = document.getElementById('profile-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleRemoveCover = () => {
        setCoverPreview(null);
        setCoverError('');
        const input = document.getElementById('cover-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    return (
        <main>
            <div className="h-screen mx-auto space-y-12">
                {/* Profile Photo Section */}
                <div className="w-full space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-2">Profile Photo</h2>

                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div
                                className={`w-32 h-32 rounded-full overflow-hidden ${profilePreview ? '' : 'bg-neutral-700'
                                    }`}
                            >
                                {profilePreview ? (
                                    <Image
                                        src={profilePreview}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>
                            {profilePreview && (
                                <button
                                    onClick={handleRemoveProfile}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1">
                            <p className="text-neutral-400 text-sm mb-2">
                                Profile photo must be JPEG or PNG
                            </p>
                            <p className="text-neutral-400 text-sm mb-4">
                                Recommended size: 120×120 px, under 4 MB
                            </p>

                            <label htmlFor="profile-upload">
                                <Button
                                    type="button"
                                    className="bg-neutral-700 hover:bg-neutral-600 text-white"
                                    onClick={() => document.getElementById('profile-upload')?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Profile Photo
                                </Button>
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleProfileChange}
                                className="hidden"
                            />

                            {profileError && (
                                <p className="text-red-400 text-sm mt-2">{profileError}</p>
                            )}
                        </div>
                    </div>
                </div>

                <Separator/>

                {/* Cover Photo Section */}
                <div className="w-full space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-2">Cover Photo</h2>

                    <div>
                        <div className="relative mb-4">
                            <div
                                className={`w-full h-44 rounded-lg overflow-hidden ${coverPreview ? '' : 'bg-neutral-700'
                                    }`}
                            >
                                {coverPreview ? (
                                    <Image
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>
                            {coverPreview && (
                                <button
                                    onClick={handleRemoveCover}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <p className="text-neutral-400 text-sm mb-2">
                            Cover photo must be JPEG or PNG
                        </p>
                        <p className="text-neutral-400 text-sm mb-4">
                            Recommended size: 1130×220 px, under 6 MB
                        </p>

                        <label htmlFor="cover-upload">
                            <Button
                                type="button"
                                className="bg-neutral-700 hover:bg-neutral-600 text-white"
                                onClick={() => document.getElementById('cover-upload')?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Cover Photo
                            </Button>
                        </label>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleCoverChange}
                            className="hidden"
                        />

                        {coverError && (
                            <p className="text-red-400 text-sm mt-2">{coverError}</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}