
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Check, Radio, Loader2, Monitor, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { getCategories } from '@/Server/Categories';
import { getIngestConfig, goLiveStream, stopLiveStream } from '@/Server/Live';
import IVSBroadcastClient from 'amazon-ivs-web-broadcast';
import { toast } from 'sonner';
import { useStream } from '@/Context/StreamContext';

interface StreamFormData {
    title: string;
    description: string;
    categoryId: string;
    thumbnail: FileList | null;
    whoCanMessage: 'everyone' | 'followers';
    isPublic: boolean;
    isMature: boolean;
}

export default function AWSStreamCreationForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
    const [ivsConfig, setIvsConfig] = useState<any>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isGoingLive, setIsGoingLive] = useState(false);
    const [isStopping, setIsStopping] = useState(false);

    // Media controls
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);


    const {
        isLive,
        setIsLive,
        streamId,
        setStreamId,
        clientRef,
        canvasRef,
        isCameraActive,
        setIsCameraActive,
        isAudioEnabled,
        setIsAudioEnabled,
        isScreenSharing,
        setIsScreenSharing,
        cameraStreamRef,
        screenStreamRef,
        microphoneStreamRef,
    } = useStream();

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    // Initialize IVS config when dialog opens
    useEffect(() => {
        if (isOpen && !ivsConfig) {
            const fetchIvsConfig = async () => {
                try {
                    setIsInitializing(true);
                    const config = await getIngestConfig();
                    setIvsConfig(config.data);
                    console.log('✅ IVS Config loaded:', config.data);
                } catch (error) {
                    console.error('❌ Failed to fetch IVS config:', error);
                } finally {
                    setIsInitializing(false);
                }
            };
            fetchIvsConfig();
        }
    }, [isOpen, ivsConfig]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<StreamFormData>({
        defaultValues: {
            title: '',
            description: '',
            categoryId: '',
            thumbnail: null,
            whoCanMessage: 'everyone',
            isPublic: true,
            isMature: false,
        },
    });

    const categoryId = watch("categoryId");
    const whoCanMessage = watch("whoCanMessage");
    const isPublic = watch("isPublic");
    const isMature = watch("isMature");

    const handleNext = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setStep(1);
        reset();
    };

    const initializeBroadcastClient = async () => {
        try {
            console.log('🎥 Initializing broadcast client...');

            const client = IVSBroadcastClient.create({
                streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
                ingestEndpoint: ivsConfig.ingestServer,
            });
            clientRef.current = client;

            if (canvasRef.current) {
                client.attachPreview(canvasRef.current);
                console.log('📺 Preview attached to canvas');
            }

            return client;
        } catch (error: any) {
            console.error('❌ Failed to initialize client:', error);
            throw new Error(`Failed to initialize broadcast: ${error.message}`);
        }
    };

    const setupMicrophone = async () => {
        if (!clientRef.current) return;

        try {
            console.log('🎤 Requesting microphone access...');
            microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
                video: false,
            });

            clientRef.current.addAudioInputDevice(microphoneStreamRef.current, 'mic1');
            setIsAudioEnabled(true);
            console.log('✅ Microphone added');
        } catch (error: any) {
            console.error('❌ Microphone setup failed:', error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                toast.warning('Microphone permission denied. You can enable it later from the controls.');
            } else if (error.name === 'NotFoundError') {
                toast.warning('No microphone found. You can still stream without audio.');
            } else {
                toast.warning('Microphone not available. You can enable it later from the controls.');
            }
        }
    };

    const toggleCamera = async () => {
        if (!clientRef.current || !isLive) return;

        try {
            if (isCameraActive) {
                console.log('📹 Turning off camera...');
                clientRef.current.removeVideoInputDevice('camera1');

                if (cameraStreamRef.current) {
                    cameraStreamRef.current.getTracks().forEach(track => track.stop());
                    cameraStreamRef.current = null;
                }

                setIsCameraActive(false);
                console.log('✅ Camera turned off');
            } else {
                console.log('📹 Requesting camera access...');
                const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;

                try {
                    cameraStreamRef.current = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: streamConfig.maxResolution.width },
                            height: { ideal: streamConfig.maxResolution.height },
                            frameRate: { ideal: 30 },
                        },
                        audio: false,
                    });

                    const index = isScreenSharing ? 1 : 0;
                    clientRef.current.addVideoInputDevice(cameraStreamRef.current, 'camera1', { index });

                    setIsCameraActive(true);
                    console.log('✅ Camera turned on');
                } catch (permissionError: any) {
                    console.error('❌ Camera permission denied:', permissionError);
                    if (permissionError.name === 'NotAllowedError' || permissionError.name === 'PermissionDeniedError') {
                        toast.error('Camera permission denied. Please allow camera access in your browser settings.');
                    } else if (permissionError.name === 'NotFoundError') {
                        toast.error('No camera found on your device.');
                    } else {
                        toast.error('Failed to access camera. Please check your permissions.');
                    }
                }
            }
        } catch (error: any) {
            console.error('❌ Camera toggle failed:', error);
            toast.error('Failed to toggle camera');
        }
    };

    const toggleScreenShare = async () => {
        if (!clientRef.current || !isLive) return;

        try {
            if (isScreenSharing) {
                console.log('🖥️ Stopping screen share...');
                clientRef.current.removeVideoInputDevice('screen1');

                if (screenStreamRef.current) {
                    screenStreamRef.current.getTracks().forEach(track => track.stop());
                    screenStreamRef.current = null;
                }

                setIsScreenSharing(false);
                console.log('✅ Screen share stopped');
            } else {
                console.log('🖥️ Requesting screen share access...');
                const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;

                try {
                    screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            width: { ideal: streamConfig.maxResolution.width },
                            height: { ideal: streamConfig.maxResolution.height },
                            frameRate: { ideal: 30 },
                        },
                        audio: true,
                    });

                    const index = isCameraActive ? 1 : 0;
                    clientRef.current.addVideoInputDevice(screenStreamRef.current, 'screen1', { index });

                    setIsScreenSharing(true);
                    console.log('✅ Screen share started');

                    screenStreamRef.current.getVideoTracks()[0].onended = () => {
                        toggleScreenShare();
                    };
                } catch (permissionError: any) {
                    console.error('❌ Screen share permission denied:', permissionError);
                    if (permissionError.name === 'NotAllowedError' || permissionError.name === 'PermissionDeniedError') {
                        toast.error('Screen share permission denied. Please try again.');
                    } else if (permissionError.name === 'NotFoundError') {
                        toast.error('Screen sharing not available.');
                    } else {
                        toast.error('Failed to start screen sharing. Please try again.');
                    }
                }
            }
        } catch (error: any) {
            console.error('❌ Screen share toggle failed:', error);
            toast.error('Failed to toggle screen sharing');
        }
    };

    const toggleAudio = () => {
        if (!microphoneStreamRef.current || !isLive) {
            // Microphone not set up yet, try to set it up now
            if (isLive && clientRef.current) {
                setupMicrophone();
            } else {
                toast.warning('Please go live first to enable microphone.');
            }
            return;
        }

        const track = microphoneStreamRef.current.getAudioTracks()[0];
        if (!track) return;

        track.enabled = !track.enabled;
        setIsAudioEnabled(track.enabled);
        console.log(track.enabled ? '🔊 Audio enabled' : '🔇 Audio muted');
    };

    const onSubmit = async (data: StreamFormData) => {
        if (!ivsConfig) {
            toast.error('IVS configuration not loaded. Please try again.');
            return;
        }

        try {
            setIsGoingLive(true);

            // Debug: Check thumbnail
            console.log('📸 Thumbnail file:', data.thumbnail?.[0]);
            console.log('📸 Thumbnail name:', data.thumbnail?.[0]?.name);
            console.log('📸 Thumbnail size:', data.thumbnail?.[0]?.size);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("categoryId", data.categoryId);
            formData.append("whoCanMessage", data.whoCanMessage);
            formData.append("isPublic", String(data.isPublic));
            formData.append("isMature", String(data.isMature));

            if (data.thumbnail && data.thumbnail.length > 0) {
                formData.append("thumbnail", data.thumbnail[0]);
                console.log('✅ Thumbnail added to FormData');
            } else {
                console.log('⚠️ No thumbnail selected');
            }

            // Debug: Log all FormData entries
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const res = await goLiveStream(formData);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to create stream");
            }

            console.log("✅ Stream created:", res.data);
            setStreamId(res?.data?.streamId || null);

            // Step 2: Initialize broadcast client
            const client = await initializeBroadcastClient();

            // Step 3: Setup microphone (optional)
            await setupMicrophone();

            // Step 4: Start broadcast
            console.log('🚀 Starting broadcast to AWS IVS...');
            await client.startBroadcast(ivsConfig.streamKey);

            setIsLive(true);
            toast.success('🔴 You are now LIVE!');
            console.log('🔴 LIVE! StreamId:', res.data.streamId);

            // Close dialog and reset form
            setIsOpen(false);
            setStep(1);
            reset();

        } catch (error: any) {
            console.error('❌ Failed to go live:', error);
            toast.error(`Failed to go live: ${error.message}`);
            stopAllMediaTracks();
        } finally {
            setIsGoingLive(false);
        }
    };

    const stopAllMediaTracks = () => {
        [cameraStreamRef, screenStreamRef, microphoneStreamRef].forEach(ref => {
            if (ref.current) {
                ref.current.getTracks().forEach(track => track.stop());
                ref.current = null;
            }
        });

        setIsCameraActive(false);
        setIsScreenSharing(false);
        setIsAudioEnabled(false);
    };

    const handleStopLive = async () => {
        if (!clientRef.current || !streamId) return;

        try {
            setIsStopping(true);
            console.log('⏹️ Stopping IVS broadcast...');

            const client = clientRef.current;

            // Remove all media devices
            try { client.removeVideoInputDevice('camera1'); } catch { }
            try { client.removeVideoInputDevice('screen1'); } catch { }
            try { client.removeAudioInputDevice('mic1'); } catch { }

            // Stop broadcast
            await client.stopBroadcast();
            console.log('✅ IVS broadcast stopped');

            // Detach preview
            try { client.detachPreview(); } catch { }

            // Stop browser media tracks
            stopAllMediaTracks();

            clientRef.current = null;
            setIsLive(false);

            const response = await stopLiveStream(streamId, ivsConfig?.playbackUrl);

            if (!response?.success) {
                throw new Error(response?.message || "Failed to stop stream");
            }

            console.log("✅ Stream stopped in backend");
            setStreamId(null);
            toast.success('Stream ended successfully');

        } catch (error: any) {
            console.error('❌ Stop live failed:', error);
            toast.error('Failed to stop live stream');
        } finally {
            setIsStopping(false);
        }
    };

    // Cleanup on unmount
    // useEffect(() => {
    //     return () => {
    //         if (isLive) {
    //             console.log('🧹 Component unmounting, cleaning up...');
    //             if (clientRef.current) {
    //                 clientRef.current.stopBroadcast().catch(console.error);
    //             }
    //             stopAllMediaTracks();
    //         }
    //     };
    // }, [isLive]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Hidden canvas for IVS broadcast */}
            <canvas
                ref={canvasRef}
                width={1080}
                height={500}
                className='mt-5 w-full max-w-full'
            />

            {/* Live Controls (shown when streaming) */}
            {isLive && (
                <div className="flex items-center gap-3">
                    {/* Audio Toggle */}
                    <Button
                        onClick={toggleAudio}
                        className={`px-4 py-6 rounded-lg shadow-lg ${isAudioEnabled
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                            }`}
                        title={isAudioEnabled ? 'Mute' : 'Unmute'}
                    >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    {/* Camera Toggle */}
                    <Button
                        onClick={toggleCamera}
                        className={`px-4 py-6 rounded-lg shadow-lg ${isCameraActive
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                        title={isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
                    >
                        {isCameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    {/* Screen Share Toggle */}
                    <Button
                        onClick={toggleScreenShare}
                        className={`px-4 py-6 rounded-lg shadow-lg ${isScreenSharing
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                        title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
                    >
                        <Monitor className="w-5 h-5" />
                    </Button>

                    {/* Stop Live Button */}
                    <Button
                        onClick={handleStopLive}
                        disabled={isStopping}
                        className="text-white font-semibold px-6 py-6 rounded-lg shadow-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                        {isStopping ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Stopping...
                            </>
                        ) : (
                            '⚫ Stop Live'
                        )}
                    </Button>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="text-white font-semibold px-6 py-6 rounded-lg shadow-lg bg-red-600 hover:bg-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLive}
                    >
                        <Radio className="w-5 h-5 mr-2" />
                        {isLive ? '🔴 LIVE' : 'Go Live'}
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-[#2d2520] border-[#3d3530] text-white p-0 max-h-[90vh] overflow-y-auto">
                    <Card className="bg-transparent border-0">
                        <DialogTitle className="sr-only">Create Stream</DialogTitle>
                        <CardContent className="p-6">
                            <h1 className="text-2xl font-semibold mb-8">Create Stream</h1>

                            {isInitializing && (
                                <div className="flex items-center justify-center py-8 text-[#ffd5c8]">
                                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                    <span>Loading stream configuration...</span>
                                </div>
                            )}

                            {!isInitializing && (
                                <>
                                    {/* Step Indicators */}
                                    <div className="flex items-center justify-center gap-32 mb-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#ffd5c8] text-[#1a1612]' : 'bg-[#16c172] text-white'
                                                }`}>
                                                {step === 2 ? <Check className="w-5 h-5" /> : '1'}
                                            </div>
                                            <span className={`text-sm ${step === 1 ? 'text-[#ffd5c8]' : 'text-[#16c172]'}`}>
                                                Basic Details
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#ffd5c8] text-[#1a1612]' : 'bg-[#4d4540] text-[#8d8580]'
                                                }`}>
                                                2
                                            </div>
                                            <span className={`text-sm ${step === 2 ? 'text-[#ffd5c8]' : 'text-[#8d8580]'}`}>
                                                Customization
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-[#3d3530] mb-6"></div>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {/* Step 1: Basic Details */}
                                        {step === 1 && (
                                            <div className="space-y-6">
                                                <div>
                                                    <Label htmlFor="streamTitle" className="text-white mb-2 block">
                                                        Stream Title *
                                                    </Label>
                                                    <Input
                                                        id="streamTitle"
                                                        placeholder="Type stream title..."
                                                        {...register('title', { required: 'Stream title is required' })}
                                                        className="border-[#4d4540] text-white placeholder:text-[#6d6560] h-12"
                                                    />
                                                    {errors.title && (
                                                        <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="description" className="text-white mb-2 block">
                                                        Description
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="Type description..."
                                                        {...register('description')}
                                                        className="border-[#4d4540] text-white placeholder:text-[#6d6560] min-h-[120px] resize-none"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="category" className="text-white mb-2 block">
                                                        Category *
                                                    </Label>
                                                    <Select
                                                        value={categoryId}
                                                        onValueChange={(value) => setValue('categoryId', value)}
                                                    >
                                                        <SelectTrigger className="border-[#4d4540] text-white h-12">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#2d2520] border-[#4d4540] text-white">
                                                            {categories.map((category) => (
                                                                <SelectItem key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-white mb-2 block">Thumbnail</Label>

                                                    <label
                                                        htmlFor="thumbnail"
                                                        className="border-2 border-dashed border-[#4d4540] rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-[#6d6560] transition-colors"
                                                    >
                                                        {thumbnailPreview ? (
                                                            <div className="relative w-full">
                                                                <Image
                                                                    src={thumbnailPreview}
                                                                    alt="Thumbnail preview"
                                                                    width={400}
                                                                    height={200}
                                                                    className="w-full max-h-48 object-cover rounded-lg"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (thumbnailPreview) {
                                                                            URL.revokeObjectURL(thumbnailPreview);
                                                                        }
                                                                        setThumbnailPreview(null);
                                                                        setValue('thumbnail', null);

                                                                        // Reset the input
                                                                        const input = document.getElementById('thumbnail') as HTMLInputElement;
                                                                        if (input) input.value = '';
                                                                    }}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Upload className="w-6 h-6 text-[#6d6560]" />
                                                                <span className="text-[#8d8580] text-sm">
                                                                    Upload thumbnail (optional)
                                                                </span>
                                                                <span className="text-[#6d6560] text-xs">
                                                                    Recommended: 1920x1080px (16:9)
                                                                </span>
                                                            </div>
                                                        )}
                                                    </label>

                                                    <input
                                                        id="thumbnail"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            // Validate file size (e.g., 5MB limit)
                                                            const maxSize = 5 * 1024 * 1024; // 5MB
                                                            if (file.size > maxSize) {
                                                                toast.error('Image size should be less than 5MB');
                                                                e.target.value = '';
                                                                return;
                                                            }

                                                            // Update form state
                                                            setValue('thumbnail', e.target.files);

                                                            // Create preview
                                                            if (thumbnailPreview) {
                                                                URL.revokeObjectURL(thumbnailPreview);
                                                            }

                                                            const previewUrl = URL.createObjectURL(file);
                                                            setThumbnailPreview(previewUrl);

                                                            console.log('✅ Thumbnail selected:', file.name, file.size, 'bytes');
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={handleCancel}
                                                        className="bg-transparent border border-[#4d4540] text-white hover:bg-[#3d3530]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handleNext}
                                                        disabled={!categoryId}
                                                        className="bg-[#ffd5c8] text-[#1a1612] hover:bg-[#ffc5b8] disabled:opacity-50"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {/* Step 2: Customization */}
                                        {step === 2 && (
                                            <div className="space-y-6">
                                                <div>
                                                    <Label className="text-white mb-3 block">Who can send messages</Label>
                                                    <RadioGroup
                                                        value={whoCanMessage}
                                                        onValueChange={(value: 'everyone' | 'followers') =>
                                                            setValue('whoCanMessage', value)
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between p-4 rounded-lg border border-[#4d4540]">
                                                            <Label htmlFor="everyone" className="text-white cursor-pointer flex-1">
                                                                Everyone
                                                            </Label>
                                                            <RadioGroupItem value="everyone" id="everyone" className="border-[#6d6560] text-[#FDD3C6]" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 rounded-lg border border-[#4d4540]">
                                                            <Label htmlFor="followers" className="text-white cursor-pointer flex-1">
                                                                Only my followers
                                                            </Label>
                                                            <RadioGroupItem value="followers" id="followers" className="border-[#6d6560]" />
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div>
                                                    <Label className="text-white mb-3 block">Visibility</Label>
                                                    <RadioGroup
                                                        value={isPublic ? 'public' : 'private'}
                                                        onValueChange={(value: 'public' | 'private') =>
                                                            setValue('isPublic', value === 'public')
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between p-4 rounded-lg border border-[#4d4540]">
                                                            <div className="flex-1">
                                                                <Label htmlFor="public" className="text-white cursor-pointer block">
                                                                    Public
                                                                </Label>
                                                                <span className="text-sm text-[#8d8580]">
                                                                    Visible to everyone on the platform
                                                                </span>
                                                            </div>
                                                            <RadioGroupItem value="public" id="public" className="border-[#6d6560]" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 rounded-lg border border-[#4d4540]">
                                                            <div className="flex-1">
                                                                <Label htmlFor="private" className="text-white cursor-pointer block">
                                                                    Private
                                                                </Label>
                                                                <span className="text-sm text-[#8d8580]">
                                                                    Only you can access this stream
                                                                </span>
                                                            </div>
                                                            <RadioGroupItem value="private" id="private" className="border-[#6d6560]" />
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div>
                                                    <Label className="text-white mb-3 block">Stream restriction</Label>
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-[#4d4540]">
                                                        <Label htmlFor="mature" className="text-white cursor-pointer">
                                                            18+ mature audience only
                                                        </Label>
                                                        <Switch
                                                            id="mature"
                                                            checked={isMature}
                                                            onCheckedChange={(checked) =>
                                                                setValue('isMature', checked)
                                                            }
                                                            className="data-[state=checked]:bg-[#ffd5c8]"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={handleBack}
                                                        className="bg-transparent border border-[#4d4540] text-white hover:bg-[#3d3530]"
                                                        disabled={isGoingLive}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="bg-red-600 text-white hover:bg-red-600/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        disabled={!ivsConfig || isGoingLive}
                                                    >
                                                        {isGoingLive ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Going Live...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Radio className="w-4 h-4" />
                                                                Go Live
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    );
}