import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
export default function ChatMessages() {
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { rooms, activeRoomId } = useAppStore();

    const activeRoom = rooms.find(room => room.id === activeRoomId);

    const copyToClipboard = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            toast.success('Message copied to clipboard', {
                duration: 2000,
                position: 'bottom-center',
            });
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast.error('Failed to copy message');
        }
    };
    useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeRoom?.messages?.length]); // Trigger only when message count changes

    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300); // Delay slightly to allow animation to complete

        return () => clearTimeout(timeout);
    }, [activeRoom?.messages?.length]);

    return (
        <div className="max-w-4xl mx-auto pt-10">
            <AnimatePresence>
                {activeRoom?.messages.length ? (
                    activeRoom?.messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mb-6 py-3 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start items-center'}`}
                        >
                            {message.role !== 'user' && (
                                <div className="">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                            {message.text === '...' ? (
                                <div className={`px-4 h-5 ${message.role === 'user'
                                    ? 'bg-[var(--sidebar)] py-3 rounded-tr-sm opacity-90 rounded-4xl shadow-sm max-w-[85%]'
                                    : 'text-[var(--foreground)] dark:text-[var(--foreground-dark)]'
                                    }`}>
                                    Thinking...
                                </div>
                            ) : (
                                <div
                                    className={`relative group px-4 ${message.role === 'user'
                                        ? 'bg-[var(--sidebar)] py-3 rounded-tr-sm opacity-90 rounded-4xl shadow-sm max-w-[85%]'
                                        : 'text-[var(--foreground)] dark:text-[var(--foreground-dark)]'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap break-words">
                                        {message.text}
                                        {message.images && message.images.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {message.images.map((image, index) => (
                                                    <Image
                                                        key={index}
                                                        src={image}
                                                        alt={`Message attachment ${index + 1}`}
                                                        className="max-w-full rounded-lg"
                                                        width={400}
                                                        height={300}
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -right-3 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => copyToClipboard(message.text, message.id)}
                                            className="p-1.5 bg-[var(--background)] dark:bg-[var(--background-dark)] hover:bg-[var(--hover)] dark:hover:bg-[var(--hover-dark)] rounded-full transition-all duration-200 cursor-copy hover:scale-110"
                                            title="Copy message"
                                            aria-label="Copy message to clipboard"
                                        >
                                            {copiedMessageId === message.id ? (
                                                <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-[var(--foreground)] hover:text-blue-500 dark:text-[var(--foreground-dark)] dark:hover:text-blue-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))) : (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center text-center text-gray-500 dark:text-gray-400"
                    >
                        <div className="bg-[var(--sidebar)] dark:bg-[var(--background-dark)] px-6 py-4 rounded-xl shadow-sm max-w-lg w-full">
                            <p className="text-sm sm:text-base">
                                💬 Start a conversation with the AI — your messages will appear here.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>
    );
}
