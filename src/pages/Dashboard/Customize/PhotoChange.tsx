/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ChannelPhotoCustomize } from '@/Server/Customize_Channel';

export default function PhotoChange() {
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string>('');
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverError, setCoverError] = useState<string>('');
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

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

        setProfileFile(file);

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

        setCoverFile(file);

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
        setProfileFile(null);
        const input = document.getElementById('profile-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleRemoveCover = () => {
        setCoverPreview(null);
        setCoverError('');
        setCoverFile(null);
        const input = document.getElementById('cover-upload') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleSubmit = async () => {
        if (!profileFile && !coverFile) {
            toast.error("Please select at least one photo to upload");
            return;
        }

        if (profileError || coverError) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData and append files
            const formData = new FormData();

            if (profileFile) {
                formData.append('profilePhoto', profileFile);
            }

            if (coverFile) {
                formData.append('coverPhoto', coverFile);
            }

            // Call the server action
            const result = await ChannelPhotoCustomize(formData);

            if (result.success) {
                toast.success(result.message || "Photos updated successfully");
                handleRemoveProfile();
                handleRemoveCover();
            } else {
                toast.error(result.message || "Failed to update photos");
                console.error("Upload failed:", result);
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
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
                                        width={128}
                                        height={128}
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
                                    type="button"
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

                            <Button
                                type="button"
                                className="bg-neutral-700 hover:bg-neutral-600 text-white"
                                onClick={() => document.getElementById('profile-upload')?.click()}
                                disabled={isSubmitting}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Profile Photo
                            </Button>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleProfileChange}
                                className="hidden"
                                disabled={isSubmitting}
                            />

                            {profileError && (
                                <p className="text-red-400 text-sm mt-2">{profileError}</p>
                            )}
                        </div>
                    </div>
                </div>

                <Separator />

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
                                        width={1130}
                                        height={220}
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
                                    type="button"
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

                        <Button
                            type="button"
                            className="bg-neutral-700 hover:bg-neutral-600 text-white"
                            onClick={() => document.getElementById('cover-upload')?.click()}
                            disabled={isSubmitting}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Cover Photo
                        </Button>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleCoverChange}
                            className="hidden"
                            disabled={isSubmitting}
                        />

                        {coverError && (
                            <p className="text-red-400 text-sm mt-2">{coverError}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isSubmitting || (!profileFile && !coverFile)}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </div>
        </main>
    );
}