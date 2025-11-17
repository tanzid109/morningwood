"use client"
import { useState } from 'react';
import { GripVertical, X, Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SocialLink {
    id: string;
    title: string;
    url: string;
}

export default function SocialLinks() {
    const [links, setLinks] = useState<SocialLink[]>([
        { id: '1', title: 'Twitter', url: 'https://x.com/khksllucan' },
        { id: '2', title: 'Twitter', url: 'https://x.com/khksllucan' },
        { id: '3', title: 'Twitter', url: 'https://x.com/khksllucan' },
        { id: '4', title: 'Twitter', url: 'https://x.com/khksllucan' },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
    const [formData, setFormData] = useState({ title: '', url: '' });

    const handleAddLink = () => {
        setEditingLink(null);
        setFormData({ title: '', url: '' });
        setIsDialogOpen(true);
    };

    const handleEditLink = (link: SocialLink) => {
        setEditingLink(link);
        setFormData({ title: link.title, url: link.url });
        setIsDialogOpen(true);
    };

    const handleDeleteLink = (id: string) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const handleSubmit = () => {
        if (formData.title && formData.url) {
            if (editingLink) {
                setLinks(links.map(link =>
                    link.id === editingLink.id
                        ? { ...link, title: formData.title, url: formData.url }
                        : link
                ));
            } else {
                const newLink: SocialLink = {
                    id: Date.now().toString(),
                    title: formData.title,
                    url: formData.url,
                };
                setLinks([...links, newLink]);
            }
            setIsDialogOpen(false);
            setFormData({ title: '', url: '' });
        }
    };

    return (
        <div className="">
            <div className=" mx-auto">
                <h3 className="text-2xl font-semibold mb-2">Add your social account</h3>
                <div className=" mb-4">
                    {/* <h2 className="text-lg font-medium">Add Social Link</h2> */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={handleAddLink}
                            >
                                <Plus size={16} />
                                Add Social Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="p-10 w-xl">
                            <AlertDialogHeader>
                                <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    {editingLink ? 'Update your social link details' : 'Add a new social media link'}
                                </DialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-white">Link Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Twitter"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-[#1a0f0f] border-gray-700 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-white">Link URL</Label>
                                    <Input
                                        id="url"
                                        placeholder="https://x.com/username"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="bg-[#1a0f0f] border-gray-700 text-white"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    
                                    onClick={() => setIsDialogOpen(false)}
                                    className="bg-red-500 rounded-md text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleSubmit}
                                    className=""
                                >
                                    {editingLink ? 'Update' : 'Add Link'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-3">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="border rounded-lg p-4 flex items-center gap-3"
                        >
                            <GripVertical size={20} className="text-gray-500 cursor-move" />

                            <div className="flex items-center gap-3 flex-1">
                                <div className="bg-[#1a0f0f] p-2 rounded">
                                    <X size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{link.title}</h3>
                                    <p className="text-sm text-gray-400">{link.url}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditLink(link)}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                >
                                    <Pencil size={18} className="text-gray-400" />
                                </button>
                                <button
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}