/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useRef, useState } from 'react';
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
import { Upload, Check, Radio, Loader2, Monitor, Video, Mic, MicOff, VideoOff, Settings } from 'lucide-react';
import { getCategories } from '@/Server/Categories';
import { getIngestConfig, goLiveStream, stopLiveStream } from '@/Server/Live';
import IVSBroadcastClient from 'amazon-ivs-web-broadcast';
import { toast } from 'sonner';

interface StreamFormData {
    title: string;
    description: string;
    categoryId: string;
    thumbnail: FileList | null;
    whoCanMessage: 'everyone' | 'followers';
    isPublic: boolean;
    isMature: boolean;
}

type StreamSource = 'camera' | 'screen' | 'both';

export default function AWSStreamCreationForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isOpen, setIsOpen] = useState(false);
    const [streamId, setStreamId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
    const [ivsConfig, setIvsConfig] = useState<any>(null);
    const [isLive, setIsLive] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isGoingLive, setIsGoingLive] = useState(false);
    const [isStopping, setIsStopping] = useState(false);

    // Media controls
    const [streamSource, setStreamSource] = useState<StreamSource>('camera');
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [useCamera, setUseCamera] = useState(true);
    const [useMicrophone, setUseMicrophone] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const clientRef = useRef<any>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const microphoneStreamRef = useRef<MediaStream | null>(null);

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

    const setupMediaDevices = async () => {
        try {
            console.log('🎥 Setting up media devices...');

            // Initialize broadcast client
            const client = IVSBroadcastClient.create({
                streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
                ingestEndpoint: ivsConfig.ingestServer,

            });
            clientRef.current = client;

            // Attach preview canvas
            if (canvasRef.current) {
                client.attachPreview(canvasRef.current);
                console.log('📺 Preview attached to canvas');
            }

            // Get devices list
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            const audioDevices = devices.filter(d => d.kind === 'audioinput');

            console.log('📹 Found', videoDevices.length, 'video devices');
            console.log('🎤 Found', audioDevices.length, 'audio devices');

            const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;

            // Setup based on stream source
            if (
                useCamera &&
                (streamSource === 'camera' || streamSource === 'both')
            ) {
                cameraStreamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: streamConfig.maxResolution.width },
                        height: { ideal: streamConfig.maxResolution.height },
                        frameRate: { ideal: 30 },
                    },
                    audio: false,
                });

                client.addVideoInputDevice(cameraStreamRef.current, 'camera1', { index: 0 });
            }


            if (streamSource === 'screen' || streamSource === 'both') {
                console.log('🖥️ Getting screen share...');
                screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: streamConfig.maxResolution.width },
                        height: { ideal: streamConfig.maxResolution.height },
                        frameRate: { ideal: 30 },
                    },
                    audio: true, // Include system audio
                });

                // Show preview for screen share
                if (previewVideoRef.current && !cameraStreamRef.current) {
                    previewVideoRef.current.srcObject = screenStreamRef.current;
                }

                const index = streamSource === 'both' ? 1 : 0;
                client.addVideoInputDevice(screenStreamRef.current, 'screen1', { index });
                console.log('✅ Screen share added');
            }

            // Get microphone
            console.log('🎤 Getting microphone...');
            if (useMicrophone) {
                microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                    video: false,
                });

                client.addAudioInputDevice(microphoneStreamRef.current, 'mic1');
            }
            console.log('✅ Microphone added');

            setShowPreview(true);
            return client;

        } catch (error: any) {
            console.error('❌ Media setup error:', error);
            throw new Error(`Failed to access media: ${error.message}`);
        }
    };
    const startScreenShare = async () => {
        if (!clientRef.current) return;

        try {
            const streamConfig = IVSBroadcastClient.BASIC_LANDSCAPE;

            screenStreamRef.current = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: streamConfig.maxResolution.width },
                    height: { ideal: streamConfig.maxResolution.height },
                    frameRate: { ideal: 30 },
                },
                audio: true,
            });

            clientRef.current.addVideoInputDevice(
                screenStreamRef.current,
                'screen1',
                { index: 1 } // keep camera at index 0
            );

            setIsScreenSharing(true);
            console.log('🖥️ Screen sharing started');

            // Auto-stop if user clicks "Stop sharing" from browser UI
            screenStreamRef.current.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };

        } catch (error) {
            console.error('❌ Failed to start screen share', error);
            toast.error('Screen share failed');
        }
    };
    const stopScreenShare = () => {
        if (!clientRef.current || !screenStreamRef.current) return;

        try {
            clientRef.current.removeVideoInputDevice('screen1');
        } catch { }

        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;

        setIsScreenSharing(false);
        console.log('🛑 Screen sharing stopped');
    };

    const toggleScreenShare = () => {
        if (isScreenSharing) {
            stopScreenShare();
        } else {
            startScreenShare();
        }
    };

    const onSubmit = async (data: StreamFormData) => {
        if (!ivsConfig) {
            toast.error('IVS configuration not loaded. Please try again.');
            return;
        }

        try {
            setIsGoingLive(true);

            // Step 1: Create stream in database
            console.log('📝 Creating stream in database...');
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("categoryId", data.categoryId);
            formData.append("whoCanMessage", data.whoCanMessage);
            formData.append("isPublic", String(data.isPublic));
            formData.append("isMature", String(data.isMature));

            if (data.thumbnail && data.thumbnail.length > 0) {
                formData.append("thumbnail", data.thumbnail[0]);
            }

            const res = await goLiveStream(formData);

            if (!res?.success) {
                throw new Error(res?.message || "Failed to create stream");
            }

            console.log("✅ Stream created:", res.data);
            setStreamId(res?.data?.streamId || null);

            // Step 2: Setup media devices
            const client = await setupMediaDevices();

            // Step 3: Start broadcast
            console.log('🚀 Starting broadcast to AWS IVS...');
            await client.startBroadcast(ivsConfig.streamKey);

            setIsLive(true);
            console.log('🔴 LIVE! StreamId:', res.data.streamId);

            // Close dialog and reset form
            setIsOpen(false);
            setStep(1);
            reset();

        } catch (error: any) {
            console.error('❌ Failed to go live:', error);
            alert(`Failed to go live: ${error.message}`);

            // Cleanup on error
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

        setShowPreview(false);
    };


    const handleStopLive = async () => {
        if (!clientRef.current || !streamId) return;

        try {
            setIsStopping(true);
            console.log('⏹️ Stopping IVS broadcast...');

            const client = clientRef.current;

            // 1️⃣ Remove media devices from IVS
            try {
                client.removeVideoInputDevice('camera1');
            } catch { }

            try {
                client.removeVideoInputDevice('screen1');
            } catch { }

            try {
                client.removeAudioInputDevice('mic1');
            } catch { }

            // 2️⃣ Stop broadcast
            await client.stopBroadcast();
            console.log('✅ IVS broadcast stopped');

            // 3️⃣ Detach preview
            try {
                client.detachPreview();
            } catch { }

            // 4️⃣ Stop browser media tracks
            stopAllMediaTracks();

            clientRef.current = null;
            setIsLive(false);

            const response = await stopLiveStream(
                streamId,
                ivsConfig?.playbackUrl
            );

            if (!response?.success) {
                throw new Error(response?.message || "Failed to stop stream");
            }

            console.log("✅ Stream stopped in backend");
            setStreamId(null);


            console.log('🛑 Stream fully stopped');
            setStreamId(null);

        } catch (error: any) {
            console.error('❌ Stop live failed:', error);
            alert('Failed to stop live stream');
        } finally {
            setIsStopping(false);
        }
    };


    const toggleAudio = () => {
        if (!microphoneStreamRef.current) {
            toast.warning('Microphone not enabled');
            return;
        }

        const track = microphoneStreamRef.current.getAudioTracks()[0];
        if (!track) return;

        track.enabled = !track.enabled;
        setIsAudioEnabled(track.enabled);
    };


    const toggleVideo = () => {
        if (!cameraStreamRef.current) {
            toast.warning('Camera not enabled');
            return;
        }

        const track = cameraStreamRef.current.getVideoTracks()[0];
        if (!track) return;

        track.enabled = !track.enabled;
        setIsVideoEnabled(track.enabled);
    };


    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isLive) {
                console.log('🧹 Component unmounting, cleaning up...');
                if (clientRef.current) {
                    clientRef.current.stopBroadcast().catch(console.error);
                }
                stopAllMediaTracks();
            }
        };
    }, [isLive]);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Hidden canvas for IVS broadcast */}
            <canvas
                ref={canvasRef}
                width={1080}
                height={720}
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

                    {/* Video Toggle */}
                    <Button
                        onClick={toggleVideo}
                        className={`px-4 py-6 rounded-lg shadow-lg ${isVideoEnabled
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                            }`}
                        title={isVideoEnabled ? 'Hide Video' : 'Show Video'}
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
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
                        className="text-white font-semibold px-6 py-6 rounded-lg shadow-lg bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
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
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Switch checked={useCamera} onCheckedChange={setUseCamera} />
                    <span>Camera</span>
                </div>

                <div className="flex items-center gap-2">
                    <Switch checked={useMicrophone} onCheckedChange={setUseMicrophone} />
                    <span>Microphone</span>
                </div>
            </div>

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
                                                {/* Stream Source Selection */}
                                                <div>
                                                    <Label className="text-white mb-3 block">Stream Source</Label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setStreamSource('camera')}
                                                            className={`p-4 rounded-lg border-2 transition-all ${streamSource === 'camera'
                                                                ? 'border-[#ffd5c8] bg-[#ffd5c8]/10'
                                                                : 'border-[#4d4540] hover:border-[#6d6560]'
                                                                }`}
                                                        >
                                                            <Video className="w-6 h-6 mx-auto mb-2" />
                                                            <div className="text-sm font-medium">Camera</div>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStreamSource('screen')}
                                                            className={`p-4 rounded-lg border-2 transition-all ${streamSource === 'screen'
                                                                ? 'border-[#ffd5c8] bg-[#ffd5c8]/10'
                                                                : 'border-[#4d4540] hover:border-[#6d6560]'
                                                                }`}
                                                        >
                                                            <Monitor className="w-6 h-6 mx-auto mb-2" />
                                                            <div className="text-sm font-medium">Screen</div>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setStreamSource('both')}
                                                            className={`p-4 rounded-lg border-2 transition-all ${streamSource === 'both'
                                                                ? 'border-[#ffd5c8] bg-[#ffd5c8]/10'
                                                                : 'border-[#4d4540] hover:border-[#6d6560]'
                                                                }`}
                                                        >
                                                            <Settings className="w-6 h-6 mx-auto mb-2" />
                                                            <div className="text-sm font-medium">Both</div>
                                                        </button>
                                                    </div>
                                                </div>

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
                                                            <Image
                                                                src={thumbnailPreview}
                                                                alt="Thumbnail preview"
                                                                width={400}
                                                                height={200}
                                                                className="w-full max-h-48 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Upload className="w-6 h-6 text-[#6d6560]" />
                                                                <span className="text-[#8d8580] text-sm">
                                                                    Upload thumbnail (optional)
                                                                </span>
                                                            </div>
                                                        )}
                                                    </label>

                                                    <input
                                                        id="thumbnail"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        {...register('thumbnail')}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            // cleanup old preview
                                                            if (thumbnailPreview) {
                                                                URL.revokeObjectURL(thumbnailPreview);
                                                            }

                                                            const previewUrl = URL.createObjectURL(file);
                                                            setThumbnailPreview(previewUrl);
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