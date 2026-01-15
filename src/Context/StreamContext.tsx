/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useRef, useState, ReactNode } from 'react';

interface StreamContextType {
    isLive: boolean;
    setIsLive: (value: boolean) => void;
    streamId: string | null;
    setStreamId: (value: string | null) => void;
    clientRef: React.MutableRefObject<any>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    isCameraActive: boolean;
    setIsCameraActive: (value: boolean) => void;
    isAudioEnabled: boolean;
    setIsAudioEnabled: (value: boolean) => void;
    isScreenSharing: boolean;
    setIsScreenSharing: (value: boolean) => void;
    cameraStreamRef: React.MutableRefObject<MediaStream | null>;
    screenStreamRef: React.MutableRefObject<MediaStream | null>;
    microphoneStreamRef: React.MutableRefObject<MediaStream | null>;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export function StreamProvider({ children }: { children: ReactNode }) {
    const [isLive, setIsLive] = useState(false);
    const [streamId, setStreamId] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const clientRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const microphoneStreamRef = useRef<MediaStream | null>(null);

    return (
        <StreamContext.Provider
            value={{
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
            }}
        >
            {children}
        </StreamContext.Provider>
    );
}

export function useStream() {
    const context = useContext(StreamContext);
    if (context === undefined) {
        throw new Error('useStream must be used within a StreamProvider');
    }
    return context;
}