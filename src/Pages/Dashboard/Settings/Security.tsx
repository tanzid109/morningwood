"use client";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
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
import { Eye, EyeOff } from "lucide-react";

export default function Securty() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        defaultValues: {
            password: "",
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log("Login Data:", data);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <main className="">
            <h2 className="text-2xl text-[#FDD3C6] font-semibold mt-6">
                Security
            </h2>
            <p className="text-[#977266] mb-6">Keep your account safe & sound</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 w-1/2"
                >
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
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword((prev) => !prev)}
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className=" flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <Spinner className="text-xl" /> : "Change Password"}
                    </Button>
                </form>
            </Form>
        </main>
    );
}
