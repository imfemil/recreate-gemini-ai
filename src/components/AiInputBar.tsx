// components/AiInputBar.tsx
'use client';

import { ImageIcon, MicIcon, PlusIcon, XIcon, Send } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptInputSchema } from '@/validations/chatroomSchema';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

type FormValues = z.infer<typeof promptInputSchema>;

export function useChatInput() {
    const [isThinking, setIsThinking] = useState(false);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const { createRoom, activeRoomId, sendMessage, receiveAIMessage } = useAppStore();

    const handleSendMessage = useCallback(async (text: string) => {
        const messageText = text.trim();

        if (!activeRoomId) {
            const name = prompt('Enter chatroom name:')?.trim();
            if (!name) {
                toast.error('Chatroom name is required');
                return;
            }
            const roomId = createRoom(name);
            toast.success(`Chatroom "${name}" created`);
            router.push(`/dashboard/${roomId}`);
            return;
        }

        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }

        throttleTimeoutRef.current = setTimeout(async () => {
            setIsThinking(true);

            try {
                sendMessage(messageText);

                const thinkingTime = Math.random() * 2000 + 1000;
                await new Promise(resolve => setTimeout(resolve, thinkingTime));

                const aiResponse = `You said: "${messageText}". This is a simulated AI response.`;
                receiveAIMessage(aiResponse);
            } catch (error) {
                console.error('Error sending message:', error);
                receiveAIMessage('Sorry, I encountered an error. Please try again.');
            } finally {
                setIsThinking(false);
            }
        }, 200);
    }, [activeRoomId, sendMessage, receiveAIMessage, router, createRoom]);

    return {
        isThinking,
        handleSendMessage
    };
}

export default function AiInputBar() {
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const { isThinking, handleSendMessage } = useChatInput();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(promptInputSchema),
        defaultValues: { message: '', images: [] },
    });

    const messageValue = watch('message');

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const currentImages = getValues('images');
        const newFiles = Array.from(files);

        if (currentImages.length + newFiles.length > 5) {
            toast.error('You can upload maximum 5 images');
            return;
        }

        newFiles.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImagePreview((prev) => [...prev, base64]);
                setValue('images', [...getValues('images'), base64]);
            };
            reader.readAsDataURL(file);
        });

        toast.success('Images uploaded successfully');
    };

    const removeImage = (index: number) => {
        const updated = [...imagePreview];
        updated.splice(index, 1);
        setImagePreview(updated);
        setValue('images', updated);
        toast.success('Image removed successfully');
    };

    const onSubmit = (data: FormValues) => {
        if (!data.message.trim()) return;
        handleSendMessage(data.message);
        reset();
        setImagePreview([]);
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full transition-all duration-300 ease-in-out border-2 rounded-2xl"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--sidebar)'
            }}
        >
            {imagePreview.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3 p-2 rounded-xl backdrop-blur-sm">
                    {imagePreview.map((image, index) => (
                        <div key={index} className="relative group transition-transform hover:scale-105">
                            <Image
                                src={image}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={100}
                                className="object-cover rounded-xl shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 rounded-full p-1.5 opacity-90 hover:opacity-100 transition-all duration-200 shadow-md"
                                style={{ backgroundColor: 'var(--sidebar)' }}
                            >
                                <XIcon className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="relative flex items-center flex-col gap-2 transition-all duration-300 p-3">
                <div className="w-full flex justify-between items-center px-2">
                    <textarea
                        {...register('message')}
                        placeholder="Ask Gemini..."
                        className="w-full outline-none focus:ring-0 py-2 transition-all duration-200 bg-transparent resize-none overflow-y-auto max-h-[200px]"
                        rows={1}
                        onKeyDown={handleKeyPress}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isThinking || !messageValue.trim()}
                        className={`ml-2 p-2.5 rounded-full transition-all duration-200 ${isThinking || !messageValue.trim()
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[var(--sidebar)] cursor-pointer'
                            }`}
                        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-full flex justify-between">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[var(--sidebar)]"
                            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div
                                className="absolute left-0 bottom-14 rounded-xl shadow-xl p-2 backdrop-blur-sm transform transition-all duration-300 ease-in-out min-w-[200px] z-10"
                                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                            >
                                <label
                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[var(--sidebar)] transition-all duration-200"
                                >
                                    <ImageIcon className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
                                    <span className="text-sm font-medium">Upload Images</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" multiple />
                                </label>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => toast.error('Voice input is currently not available')}
                        className="p-2.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[var(--sidebar)]"
                        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {(errors.message || errors.images) && (
                <div className="mt-2 text-sm text-red-500 px-4 pb-2">
                    {errors.message?.message || errors.images?.message}
                </div>
            )}
        </form>
    );
}
