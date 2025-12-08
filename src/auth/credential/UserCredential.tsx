"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import { CredentialSchema } from "./CredentialValidation";
import PasswordRequirement from "./PasswordRequirement";
import { toast } from "sonner";
import { getCredential } from "@/Server/Auth/Index";

export default function CredentialForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    const form = useForm({
        resolver: zodResolver(CredentialSchema),
        defaultValues: {
            channel: "",
            user: "",
            password: "",
        },
    });

    const searchParams = useSearchParams();
    const signupToken = searchParams?.get('token') || null;
    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const registrationData = {
                username: data.user,
                channelName: data.channel,
                password: data.password,
                signupToken: signupToken,
            };
            console.log(registrationData);
            const res = await getCredential(registrationData);
            console.log("Server Response:", res);
            if (res?.success) {
                router.push(`/`);
                toast.success(res.message);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleClose = () => {
        router.push("/");
    }

    const handleBack = () => router.back();

    return (
        <main className="flex justify-center items-center min-h-screen max-w-5xl mx-auto p-2">
            <div className="flex flex-col-reverse md:flex-row-reverse border rounded-lg overflow-hidden shadow-lg">
                {/* Left Section - Form */}
                <section className="relative flex flex-col justify-center items-start w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-10">
                    <div className="absolute top-3 left-3">
                        <Button
                            onClick={handleBack}
                            className="text-[#FDD3C6] hover:bg-[#3A211B]"
                            aria-label="Go back"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Button onClick={() => handleClose()}><X /></Button>
                    </div>
                    <h2 className="text-2xl font-semibold my-4">
                        User Credentials
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 w-full"
                        >
                            {/* Channel Field */}
                            <FormField
                                control={form.control}
                                name="channel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter Your Channel Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* user Field */}
                            <FormField
                                control={form.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter Your Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setPasswordValue(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-[#7c5f56] text-[#A47E72]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                        {/* Password Requirements */}
                                        <PasswordRequirement password={passwordValue} />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Spinner className="text-xl" /> : "Complete Sign Up"}
                            </Button>
                        </form>
                    </Form>

                    <p className="mt-4 text-sm tracking-wide text-[#A47E72] text-center">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-[#FDD3C6] font-semibold underline">
                            Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#FDD3C6] font-semibold underline">
                            Privacy Policy
                        </Link>.
                    </p>
                </section>

                {/* Right Section - Logo / Image */}
                <section className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-10">
                    <Image
                        src="/assets/logobig.png"
                        width={256}
                        height={256}
                        alt="App logo"
                        priority
                    />
                </section>
            </div>
        </main>
    );
}