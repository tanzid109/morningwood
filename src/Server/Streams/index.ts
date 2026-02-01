"use server"

import { cookies } from "next/headers";

interface GetAllLiveParams {
    page?: number;
    limit?: number;
}

export const getAllLiveStreams = async (params?: GetAllLiveParams) => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/currently-live${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}


export const getAllRecordedStreams = async (params?: GetAllLiveParams) => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/recordings${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}


export const getPlayStream = async (streamId: string, playbackUrl?: string) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/${streamId}/watch`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
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

export const getAllLovedStreams = async (params?: GetAllLiveParams) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const queryParams = new URLSearchParams();
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/streams/my-liked${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}


