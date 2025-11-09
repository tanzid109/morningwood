"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginValidation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function LoginForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const loginData = {
                email: data.email,
                password: data.password,
            };

            console.log("Login Data:", loginData);
            
            
            // // simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 2000));                                                                                                                                                                                    

            // // redirect on success
            // router.push("/");
        } catch (error) {
            console.error(error);
        }
        finally{
            setOpen(false)
        }
    };

    return (
        <main className="flex justify-center p-5 max-w-5xl mx-auto">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Sign In</Button>
                </DialogTrigger>

                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                    <DialogHeader>

                        <DialogTitle className="sr-only">Sign In </DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex flex-col md:flex-row-reverse">

                                {/* Left Section - Form */}
                                <div className="relative flex flex-col justify-center items-center w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-10">
                                    <div className="absolute top-3  left-3">
                                        <Button onClick={window.history.back}><ArrowLeft /></Button>
                                    </div>
                                    <h2 className="text-[#FDD3C6] text-2xl text-left font-semibold my-6">
                                        Sign in with your email/username
                                    </h2>

                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="space-y-5 w-full"
                                        >
                                            {/* Email Field */}
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                {...field}
                                                                placeholder="Email Address"
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
                                                                    {...field}
                                                                    placeholder="Enter Password"
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    setShowPassword((prev) => !prev)
                                                                }
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-[#2489B0]"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff size={18} />
                                                                ) : (
                                                                    <Eye size={18} />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Remember Me + Forgot */}
                                            <div className="flex items-center justify-between text-sm mt-4">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox id="remember" />
                                                    <Label
                                                        htmlFor="remember"
                                                        className="font-semibold"
                                                    >
                                                        Remember me
                                                    </Label>
                                                </div>
                                                <Link
                                                    href="/forget"
                                                    className="text-[#FF4D4F] font-medium"
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>

                                            {/* Submit Button */}
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full flex justify-center items-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <Spinner className="text-xl" />
                                                ) : (
                                                    "Sign In"
                                                )}
                                            </Button>
                                        </form>
                                    </Form>

                                    <p className="text-center mt-4 text-sm">
                                        Don’t have an account?
                                        <Link
                                            href="/signup"
                                            className="text-[#FDD3C6] font-semibold ml-1 hover:underline"
                                        >
                                            Sign Up
                                        </Link>
                                    </p>

                                    <p className="mt-4 text-xs text-gray-500">
                                        By signing in, you agree to our{" "}
                                        <span className="text-[#FDD3C6] font-semibold">
                                            Terms & Conditions
                                        </span>{" "}
                                        and{" "}
                                        <span className="text-[#FDD3C6] font-semibold">
                                            Privacy Policy
                                        </span>
                                        .
                                    </p>
                                </div>

                                {/* Right Section - Logo / Animation */}
                                <div className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-10">
                                    <Image
                                        src="/assets/logobig.png"
                                        width={256}
                                        height={256}
                                        alt="logo"
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    );
}
