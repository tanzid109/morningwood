/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useRef, useState } from 'react';
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
import { Upload, Check, Radio } from 'lucide-react';
import { getCategories } from '@/Server/Categories';
import { getIngestConfig, goLiveStream } from '@/Server/Live';
import { AmazonIVSBroadcastClient } from 'amazon-ivs-web-broadcast';

interface StreamFormData {
    title: string;
    description: string;
    categoryId: string;
    thumbnail: FileList | null;
    whoCanMessage: 'everyone' | 'followers';
    isPublic: boolean;
    isMature: boolean;
}

export default function StreamCreationForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isOpen, setIsOpen] = useState(false);
    const [streamId, setStreamId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
    const [ivsConfig, setIvsConfig] = useState<any>(null);
    const [isLive, setIsLive] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const clientRef = useRef<AmazonIVSBroadcastClient | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategories();
            setCategories(res.data);
        };
        fetchCategories();
    }, []);

    // Initialize IVS config and client when dialog opens
    useEffect(() => {
        if (isOpen && !ivsConfig) {
            const fetchIvsConfig = async () => {
                try {
                    const config = await getIngestConfig();
                    setIvsConfig(config.data);
                    console.log(config);
                    // Initialize broadcast client
                    if (canvasRef.current) {
                        const client = AmazonIVSBroadcastClient.create({
                            canvas: canvasRef.current
                        });
                        clientRef.current = client;
                    }
                } catch (error) {
                    console.error('Failed to fetch IVS config:', error);
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
            isPublic: false,
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

    const onSubmit = async (data: StreamFormData) => {
        try {
            if (!clientRef.current || !ivsConfig) {
                console.error('IVS client or config not initialized');
                return;
            }

            // Step 1: Create stream in database
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
                console.error(res?.message || "Failed to go live");
                return;
            }

            console.log("Stream created:", res);
            setStreamId(res?.data?.streamId || null);

            // Step 2: Get camera and microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });

            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            const videoInput = clientRef.current.getVideoInputDevice(videoTrack);
            const audioInput = clientRef.current.getAudioInputDevice(audioTrack);

            clientRef.current.addVideoInputDevice(videoInput);
            clientRef.current.addAudioInputDevice(audioInput);

            // Step 3: Start IVS broadcast
            await clientRef.current.startBroadcast(
                ivsConfig.ingestServer,
                ivsConfig.streamKey
            );

            setIsLive(true);
            console.log('🔴 LIVE! StreamId:', res.data.streamId);

            // Close dialog and reset form
            setIsOpen(false);
            setStep(1);
            reset();

        } catch (error) {
            console.error('Failed to go live:', error);
        }
    };

    const handleStopLive = async () => {
        if (!clientRef.current || !streamId) return;

        try {
            // Stop broadcast
            await clientRef.current.stopBroadcast();
            setIsLive(false);

            const token = localStorage.getItem('creatorToken');

            // Update database
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/${streamId}/stop-live`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playbackUrl: ivsConfig.playbackUrl,
                })
            });

            console.log('⚫ Stream stopped');
            setStreamId(null);

        } catch (error) {
            console.error('Failed to stop:', error);
        }
    };

    return (
        <div className="flex items-center justify-center">
            {/* Hidden canvas for IVS broadcast */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                style={{ display: 'none' }}
            />

            {/* Stop Live Button (shown when streaming) */}
            {isLive && (
                <Button
                    onClick={handleStopLive}
                    className="text-white font-semibold px-6 py-6 rounded-lg shadow-lg bg-gray-600 hover:bg-gray-700 mr-4"
                >
                    ⚫ Stop Live
                </Button>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="text-white font-semibold px-6 py-6 rounded-lg shadow-lg bg-red-600 hover:bg-red-600/70"
                        disabled={isLive}
                    >
                        <Radio className="w-5 h-5 mr-2" />
                        {isLive ? '🔴 LIVE' : 'Go Live'}
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-[#2d2520] border-[#3d3530] text-white p-0 max-h-[90vh] overflow-y-auto">
                    <Card className="bg-transparent border-0">
                        <DialogTitle />
                        <CardContent className="p-6">
                            <h1 className="text-2xl font-semibold mb-8">Create Stream</h1>

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
                                                Stream Title
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
                                                className="border-[#4d4540] text-white placeholder:text-[#6d6560] min-h-[180px] resize-none"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="category" className="text-white mb-2 block">
                                                Category
                                            </Label>
                                            <Select
                                                value={categoryId}
                                                onValueChange={(value) => setValue('categoryId', value)}
                                            >
                                                <SelectTrigger className="border-[#4d4540] text-white">
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
                                            <label htmlFor="thumbnail" className="border-2 border-dashed border-[#4d4540] rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#6d6560] transition-colors">
                                                <Upload className="w-8 h-8 text-[#6d6560]" />
                                                <span className="text-[#8d8580] text-sm">Upload thumbnail</span>
                                                <input
                                                    id="thumbnail"
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('thumbnail')}
                                                    className="hidden"
                                                />
                                            </label>
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
                                                className="bg-[#ffd5c8] text-[#1a1612] hover:bg-[#ffc5b8]"
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
                                                            Only you can access this stream.
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
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-red-600 text-white hover:bg-red-600/70"
                                                disabled={!ivsConfig}
                                            >
                                                Go Live
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    );
}