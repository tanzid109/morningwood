"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    GripVertical,
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { createChannelSocialInfo } from "@/Server/Customize_Channel";
import { toast } from "sonner";

interface SocialLink {
    id: string;
    platform: string;
    url: string;
    displayName: string;
}

interface SocialFormValues {
    platform: string;
    url: string;
    displayName: string;
}


export default function SocialLinks() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

    const form = useForm<SocialFormValues>({
        defaultValues: {
            platform: "",
            url: "",
            displayName: "",
        },
    });

    const handleAdd = () => {
        setEditingLink(null);
        form.reset();
        setIsDialogOpen(true);
    };

    const handleEdit = (link: SocialLink) => {
        setEditingLink(link);
        form.reset({
            platform: link.platform,
            url: link.url,
            displayName: link.displayName,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setLinks((prev) => prev.filter((link) => link.id !== id));
    };

    const onSubmit = async (values: SocialFormValues) => {
        const payload = {
            platform: values.platform.toLowerCase(),
            url: values.url,
            displayName: values.displayName,
        };

        const res = await createChannelSocialInfo(payload)

        if (res.success) {
            toast.success(res.message)
        }

        if (editingLink) {
            setLinks((prev) =>
                prev.map((link) =>
                    link.id === editingLink.id
                        ? { ...link, ...payload }
                        : link
                )
            );
        } else {
            setLinks((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    ...payload,
                },
            ]);
        }

        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">
                Add your social account
            </h3>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                        <Plus size={16} />
                        Add Social Link
                    </Button>
                </DialogTrigger>

                <DialogContent className="p-8 max-w-lg">
                    <AlertDialogHeader>
                        <DialogTitle>
                            {editingLink ? "Edit Link" : "Add New Link"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter your social platform details
                        </DialogDescription>
                    </AlertDialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Platform */}
                            <FormField
                                control={form.control}
                                name="platform"
                                rules={{ required: "Platform is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="facebook / twitter"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Display Name */}
                            <FormField
                                control={form.control}
                                name="displayName"
                                rules={{ required: "Display name is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="My Twitter"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* URL */}
                            <FormField
                                control={form.control}
                                name="url"
                                rules={{
                                    required: "URL is required",
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "Enter a valid URL",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://twitter.com/username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingLink ? "Update" : "Add Link"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="space-y-3 mt-6">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="border rounded-lg p-4 flex items-center gap-3"
                    >
                        <GripVertical className="text-gray-500" />

                        <div className="flex-1">
                            <h3 className="font-medium">
                                {link.displayName}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {link.url}
                            </p>
                        </div>

                        <button onClick={() => handleEdit(link)}>
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(link.id)}>
                            <Trash2 size={18} className="text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
