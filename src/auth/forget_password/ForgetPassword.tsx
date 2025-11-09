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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forgetSchema } from "./ForgetValidation";
import { Spinner } from "@/components/ui/spinner";

export default function ForgetPasswordForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(forgetSchema),
        defaultValues: {
            email: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log(data);
            // simulate API request
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/verification");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="md:my-10 my-2 bg-white flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-10 p-6 sm:p-8 mt-4 md:m-0 rounded-2xl shadow-xl bg-white w-full max-w-md mb-4 border-t-2 ">

                {/* Left Section - Form */}
                <div className="flex flex-col justify-center items-center text-black rounded-2xl w-full max-w-md">
                    <div className="w-full md:my-10">
                        <div className="text-left mb-6">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                Forgot Password
                            </h3>
                            <p className="text-gray-500 text-base">Enter your email, we will send a verification code to your email.</p>
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
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    className="w-full flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner className="text-xl" />
                                            Sending Code...
                                        </>
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
