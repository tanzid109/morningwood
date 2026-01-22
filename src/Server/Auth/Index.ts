"use server"

import { cookies } from "next/headers"
import { FieldValues } from "react-hook-form"
import { jwtDecode } from "jwt-decode"

const getSecureCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
});

const clearCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
});

export const createUser = async (UserData: FieldValues) => {
    const { signupToken, ...rest } = UserData;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/signup/init`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signup-token": signupToken,
            },
            body: JSON.stringify(rest),
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

        if (data.success) {
            (await cookies()).set("accessToken", data?.data?.accessToken, getSecureCookieOptions())
        }
        return data
    } catch (error) {
        console.error("Error creating user:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const getOtp = async (otpData: FieldValues) => {
    const { signupToken, ...rest } = otpData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signup-token": signupToken,
            },
            body: JSON.stringify(rest),
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
        if (data.success) {
            (await cookies()).set("accessToken", data?.data?.accessToken, getSecureCookieOptions())
        }
        return data
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const getCredential = async (CredentialData: FieldValues) => {
    const { signupToken, ...rest } = CredentialData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signup-token": signupToken,
            },
            body: JSON.stringify(rest),
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
        if (data.success) {
            (await cookies()).set("accessToken", data?.data?.accessToken, getSecureCookieOptions())
        }
        return data
    } catch (error) {
        console.error("Error completing signup:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const resendOtp = async (otpResend: FieldValues) => {
    const { signupToken, ...rest } = otpResend;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signup-token": signupToken,
            },
            body: JSON.stringify(rest),
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
        console.error("Error resending OTP:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const loginUser = async (LoginData: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(LoginData),
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

        if (data.success) {
            (await cookies()).set("accessToken", data.data.accessToken, getSecureCookieOptions())
        }

        return data
    } catch (error) {
        console.error("Error during login:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const forgotUser = async (email: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(email),
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
        console.error("Error sending mail:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const verifyOtp = async (otpData: FieldValues) => {
    const { resetToken, ...rest } = otpData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/verify-forgot-password-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-reset-token": resetToken,
            },
            body: JSON.stringify(rest),
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
        if (data.success) {
            (await cookies()).set("accessToken", data?.data?.accessToken, getSecureCookieOptions())
        }
        return data
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const resetUserPassword = async (passwordData: FieldValues) => {
    const { resetToken, ...rest } = passwordData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-reset-token": resetToken,
            },
            body: JSON.stringify(rest),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error resetting password:", error);
        return {
            success: false,
            message: "Network error occurred"
        }
    }
};

export const getCurrentUser = async () => {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const decodedData = jwtDecode(accessToken);
        return decodedData;
    } catch (error) {
        console.error("Error decoding token:", error);
        // Clear invalid cookie
        (await cookies()).set("accessToken", "", clearCookieOptions());
        return null;
    }
}

export const changeUserPassword = async (passwordData: FieldValues) => {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/change-password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error changing password:", error);
        return {
            success: false,
            message: "Network error occurred"
        }
    }
};

export const logoutUser = async () => {
    try {
        (await cookies()).set("accessToken", "", clearCookieOptions());
        return { success: true };
    } catch (error) {
        console.error("Error during logout:", error);
        return { success: false };
    }
}