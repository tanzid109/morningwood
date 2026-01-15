"use client";

import { useForm, SubmitHandler } from "react-hook-form";
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
import { ChannelInfoCustomize } from "@/Server/Customize_Channel";
import { toast } from "sonner";

interface ChannelFormValues {
    channelName: string;
    userName: string;
    description: string;
}

export default function BasicInfo() {
    const form = useForm<ChannelFormValues>({
        defaultValues: {
            channelName: "",
            userName: "",
            description: "",
        },
    });

    const {
        formState: { isSubmitting },
        reset,
    } = form;

    const onSubmit: SubmitHandler<ChannelFormValues> = async (data) => {
        try {
            const res = await ChannelInfoCustomize(data);

            if (res?.success) {
                toast.success(res.message || "Channel info updated");
                reset();
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Channel update error:", error);
            toast.error("Failed to update channel info");
        }
    };

    return (
        <main className="flex justify-center items-center my-5">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 w-full"
                >
                    {/* Channel Name */}
                    <FormField
                        control={form.control}
                        name="channelName"
                        rules={{ required: "Channel name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Channel Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* User Name */}
                    <FormField
                        control={form.control}
                        name="userName"
                        rules={{ required: "User name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input
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
                        rules={{
                            maxLength: {
                                value: 300,
                                message: "Description must be under 300 characters",
                            },
                        }}
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

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        {isSubmitting ? <Spinner /> : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </main>
    );
}
