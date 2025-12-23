"use server";

import { cookies } from "next/headers";

export const getIngestConfig = async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found",
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/ingest-config`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
                next: {
                    revalidate: 0,
                },
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`,
            };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching ingest config:", error);
        return {
            success: false,
            message: "Network error occurred",
        };
    }
};

export const goLiveStream = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found",
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/go-live`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            return {
                success: false,
                message:
                    errorData.message || `HTTP error! status: ${res.status}`,
            };
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error going live:", error);
        return {
            success: false,
            message: "Network error occurred",
        };
    }
};

export const stopLiveStream = async (streamId: string, playbackUrl?: string) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found",
            };
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/stop-live`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    playbackUrl: playbackUrl || "",
                }),
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            return {
                success: false,
                message:
                    errorData.message || `HTTP error! status: ${res.status}`,
            };
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error stopping live stream:", error);
        return {
            success: false,
            message: "Network error occurred",
        };
    }
};

