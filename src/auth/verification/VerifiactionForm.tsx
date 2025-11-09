"use client";

import { Button } from "@/components/ui/button";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "./OtpValidation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function VerifiactionForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
        mode: "onChange",
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log(data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(error);
        }
        finally{
            router.push("/reset")
        }
    };


    return (
        <>
            {/* OTP FORM */}
            <div className="md:mt-10 mt-2 flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-md border-t-2 border-[#635BFF] bg-white text-black rounded-xl shadow-lg p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-left mb-6">
                        <h1 className="text-2xl font-semibold">Verification Code</h1>
                        <p className="w-2/3 text-sm text-gray-600 mt-2">
                            Enter the verification code that we’ve sent to your email
                        </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 flex flex-col items-center"
                        >
                            <Controller
                                name="otp"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <InputOTP
                                            maxLength={4}
                                            value={field.value || ""}
                                            onChange={(val) => {
                                                if (/^\d*$/.test(val)) field.onChange(val);
                                            }}
                                            className="gap-3"
                                        >
                                            <InputOTPGroup className="flex gap-3">
                                                {[0, 1, 2, 3].map((index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="w-14 h-10 text-lg font-semibold border border-[#E2E8F0] text-center transition-all active:bg-[#635BFF]"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Resend code */}
                            <div className="text-sm text-gray-700 text-center">
                                Didn’t receive the code?
                                <Link
                                    href="#"
                                    className="text-[#FF4D4F] font-semibold ml-1 hover:underline"
                                >
                                    Resend Code
                                </Link>
                                <p className="mt-1">Resend code at 00:59</p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? <Spinner /> : "Continue"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
}
