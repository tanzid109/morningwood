import { z } from "zod";

export const CredentialSchema = z.object({
    channel: z
        .string()
        .nonempty("Channel name is required")
        .min(4, "Channel must be at least 4 characters"),
    user: z
        .string()
        .nonempty("Username is required")
        .min(3, "Username must be at least 3 characters"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character"),
});