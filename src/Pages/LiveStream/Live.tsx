"use client";
/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useRef, useState } from "react";
import { AmazonIVSBroadcastClient } from "amazon-ivs-web-broadcast";
import { Button } from "@/components/ui/button";
import { getIngestConfig, goLiveStream } from "@/Server/Live";

export default function LiveForm() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
    const clientRef = useRef<AmazonIVSBroadcastClient | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const [ivsConfig, setIvsConfig] = useState<any>(null);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1️⃣ Create IVS Client ONCE
    useEffect(() => {
        if (!canvasRef.current || clientRef.current) return;

        clientRef.current = AmazonIVSBroadcastClient.create({
            canvas: canvasRef.current,
            streamConfig: AmazonIVSBroadcastClient.STANDARD_LANDSCAPE,
        });
    }, []);

    // 2️⃣ Fetch ingest config
    const initIVS = async () => {
        const res = await getIngestConfig();
        setIvsConfig(res.data);
    };

    // 3️⃣ Start Live
    const startLive = async () => {
        try {
            if (!clientRef.current) return;
            setLoading(true);

            // create stream in DB
            await goLiveStream({
                title: "My Live",
                description: "Chill coding",
            });

            if (!ivsConfig) await initIVS();

            // get camera + mic
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true,
            });

            mediaStreamRef.current = mediaStream;

            // preview
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = mediaStream;
            }

            // attach devices
            const videoTrack = mediaStream.getVideoTracks()[0];
            const audioTrack = mediaStream.getAudioTracks()[0];

            const videoInput =
                clientRef.current.getVideoInputDevice(videoTrack);
            const audioInput =
                clientRef.current.getAudioInputDevice(audioTrack);

            clientRef.current.addVideoInputDevice(videoInput);
            clientRef.current.addAudioInputDevice(audioInput);

            // start broadcast
            await clientRef.current.startBroadcast(
                ivsConfig.ingestServer,
                ivsConfig.streamKey
            );

            setIsLive(true);
            console.log("🔴 LIVE");

        } catch (err) {
            console.error("Start live failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // 4️⃣ Stop Live
    const stopLive = async () => {
        try {
            if (!clientRef.current) return;

            await clientRef.current.stopBroadcast();

            mediaStreamRef.current?.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;

            setIsLive(false);
            console.log("⚫ Stream stopped");
        } catch (err) {
            console.error("Stop failed:", err);
        }
    };

    return (
        <div className="space-y-4">

            {/* Hidden canvas used by IVS encoder */}
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                style={{ display: "none" }}
            />

            {/* Camera preview */}
            <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-lg bg-black"
            />

            {!isLive ? (
                <Button onClick={startLive} disabled={loading}>
                    {loading ? "Starting..." : "🔴 Go Live"}
                </Button>
            ) : (
                <Button onClick={stopLive} variant="destructive">
                    ⚫ Stop Live
                </Button>
            )}
        </div>
    );
}
