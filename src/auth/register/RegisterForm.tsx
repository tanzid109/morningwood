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
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import RegisterAnimation from "../../../public/animation/register.json";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterForm() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            Cpassword: "",
        },
    });

    const password = form.watch("password");
    const passwordConfirm = form.watch("Cpassword");

    const {
        formState: { isSubmitting },
    } = form;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Get role from sessionStorage when component mounts
    useEffect(() => {
        const selectedRole = sessionStorage.getItem("selectedRole"); // Looking in sessionStorage
        if (!selectedRole) {
            router.push("/register"); // Redirects back if not found
        } else {
            setRole(selectedRole);
        }
    }, [router]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            // Include role in registration data
            const registrationData = {
                email: data.email,
                password: data.password,
                role: role, // Artist or Investor
            };

            console.log("Registration Data:", registrationData);

            // Here you would call your API to save to database
            // Example:
            // const response = await fetch('/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(registrationData)
            // });

            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Clear the role from sessionStorage after successful registration
            sessionStorage.removeItem("selectedRole");
        } catch (error) {
            console.error(error);
        } finally {
            router.push("/otp");
        }
    };

    // Show loading while checking for role
    if (!role) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <Spinner className="text-3xl" />
            </div>
        );
    }

    return (
        <div className="lg:my-10 bg-white flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-10 p-6 sm:p-8 mt-4 md:m-0 rounded-2xl shadow-xl bg-white w-full max-w-6xl mb-4 border-t-2 border-[#635BFF]">

                {/* Left Section - Form */}
                <div className="flex flex-col justify-center items-center text-black rounded-2xl w-full max-w-md">
                    <div className="w-full">
                        <div className="text-left mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                                Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                            </h1>
                            <p className="text-gray-500 text-base">Let&apos;s create your new account</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} placeholder="Email Address" />
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
                                            <FormLabel className="text-gray-700">Password</FormLabel>
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
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-[#2489B0]"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="Cpassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        {...field}
                                                        placeholder="Confirm Password"
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-[#2489B0]"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </Button>
                                            </div>

                                            {/* Password Match Message */}
                                            {passwordConfirm && password !== passwordConfirm && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    Passwords do not match
                                                </p>
                                            )}

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={
                                        isSubmitting || Boolean(passwordConfirm && password !== passwordConfirm)
                                    }
                                    className="w-full flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner className="text-xl" />
                                            Registering...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <h2 className="text-center mt-4 text-gray-700">
                            Already have an account?
                            <Link
                                href="/login"
                                className="text-[#635BFF] font-semibold ml-1 hover:underline"
                            >
                                Sign In
                            </Link>
                        </h2>
                    </div>
                </div>

                {/* Right Section - Lottie Animation */}
                <div className="flex justify-center items-center w-full lg:w-1/2">
                    <div className="w-[100%] md:w-[60%] lg:w-[70%] xl:w-[100%]">
                        <Lottie
                            animationData={RegisterAnimation}
                            loop={true}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}