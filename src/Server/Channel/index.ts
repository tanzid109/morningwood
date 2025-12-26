"use server"

import { cookies } from "next/headers";

function decodeJWT(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const payload = parts[1];
        const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

export const getChannelDetails = async () => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        // Decode JWT to get user ID
        const decodedToken = decodeJWT(accessToken);
        const userId = decodedToken.id;
        if (!decodedToken || !decodedToken.id) {
            return {
                success: false,
                message: "Invalid token or user ID not found"
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/users/${userId}/channel-details`, {
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
        console.error("Error fetching dashboard stats:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}