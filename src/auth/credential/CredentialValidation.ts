import { z } from "zod";

export const CredentialSchema = z.object({
    channel: z
        .string()
        .nonempty("Email is required")
        .min(4, "channel must be at least 4 characters"),
    user: z
        .string()
        .nonempty("Email is required")
        .min(3, "Password must be at least 3 characters"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),
});
