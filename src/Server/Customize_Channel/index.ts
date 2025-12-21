"use server"
import { cookies } from "next/headers"
import { FieldValues } from "react-hook-form";

// Helper function to decode JWT
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

export const ChannelPhotoCustomize = async (formData: FormData) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            console.error("No access token found");
            return {
                success: false,
                message: "No access token found. Please log in again."
            }
        }

        // Decode JWT to get user ID
        const decodedToken = decodeJWT(accessToken);

        if (!decodedToken || !decodedToken.id) {
            console.error("Invalid token or user ID not found");
            return {
                success: false,
                message: "Invalid authentication token"
            }
        }

        const userId = decodedToken.id;
        console.log("User ID:", userId);

        // Get files from FormData
        const profilePhoto = formData.get("profilePhoto") as File | null
        const coverPhoto = formData.get("coverPhoto") as File | null

        console.log("Profile photo:", profilePhoto?.name, profilePhoto?.size);
        console.log("Cover photo:", coverPhoto?.name, coverPhoto?.size);

        // Create new FormData for the API request
        const apiFormData = new FormData()

        if (profilePhoto && profilePhoto.size > 0) {
            apiFormData.append("profilePhoto", profilePhoto)
        }

        if (coverPhoto && coverPhoto.size > 0) {
            apiFormData.append("coverPhoto", coverPhoto)
        }

        // If no files to upload, return early
        if (!apiFormData.has("profilePhoto") && !apiFormData.has("coverPhoto")) {
            console.error("No valid photos to upload");
            return {
                success: false,
                message: "No photos selected"
            }
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/users/${userId}/channel-photos`;
        console.log("API URL:", apiUrl);

        const res = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                // Don't set Content-Type - let the browser set it with boundary
            },
            body: apiFormData,
            credentials: "include",
            cache: "no-store",
        })

        console.log("Response status:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("API error response:", errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            return {
                success: false,
                message: errorData.message || `Failed to upload photos (${res.status})`
            }
        }

        const data = await res.json()
        console.log("Success response:", data);

        return {
            success: true,
            message: "Photos updated successfully",
            data
        }
    } catch (error) {
        console.error("Error updating channel photos:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Network error occurred"
        }
    }
}

export const ChannelInfoCustomize = async (formData: FieldValues) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            };
        }

        // Decode JWT to get user ID
        const decodedToken = decodeJWT(accessToken);

        if (!decodedToken || !decodedToken.id) {
            return {
                success: false,
                message: "Invalid token or user ID not found"
            };
        }

        const userId = decodedToken.id;
        console.log(userId);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/users/${userId}/channel-info`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            };
        }

        const responseData = await res.json();
        return {
            success: true,
            message: "Channel info updated successfully",
            data: responseData
        };
    } catch (error) {
        console.error("Error updating channel info:", error);
        return {
            success: false,
            message: "Network error occurred"
        };
    }
};

export const createChannelSocialInfo = async (formData: FieldValues) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            };
        }

        // Decode JWT to get user ID
        const decodedToken = decodeJWT(accessToken);

        if (!decodedToken || !decodedToken.id) {
            return {
                success: false,
                message: "Invalid token or user ID not found"
            };
        }

        const userId = decodedToken.id;
        console.log(userId);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/users/${userId}/social-accounts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            };
        }

        const responseData = await res.json();
        return {
            success: true,
            message: "Channel info updated successfully",
            data: responseData
        };
    } catch (error) {
        console.error("Error updating channel info:", error);
        return {
            success: false,
            message: "Network error occurred"
        };
    }
};
