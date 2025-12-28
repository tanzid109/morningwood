"use server"

import { cookies } from "next/headers";

export const getAllFollwer = async () => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/creators`, {
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