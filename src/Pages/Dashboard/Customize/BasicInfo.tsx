"use client";
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
import { Textarea } from "@/components/ui/textarea";
export default function BasicInfo() {
    const form = useForm();
    const { formState: { isSubmitting } } = form;
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log(data);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <main className="flex justify-center items-center my-5">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 w-full"
                >
                    {/* channel Field */}
                    <FormField
                        control={form.control}
                        name="channelName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Channel Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* user field */}
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="User Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write description here"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? <Spinner className="text-xl" /> : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </main>
    );
}
