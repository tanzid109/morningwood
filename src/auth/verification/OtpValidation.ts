import { z } from "zod";

export const otpSchema = z.object({
    otp: z
        .string()
        .nonempty("OTP is required")
        .regex(/^\d{4}$/, "OTP must be exactly 6 digits (numbers only)"),
});
