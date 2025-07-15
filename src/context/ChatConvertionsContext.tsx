'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { simulateAiResponse } from '@/lib/chatUtils';
import { Conversation, Message } from '@/types';

interface ChatConvertionsContextProps {
    conversation: Conversation;
    sendMessage: (message: string) => void;
    roomTitle: string;
    loadMoreMessages: () => void;
    hasMore: boolean;
}

const ChatConvertionsContext = createContext<ChatConvertionsContextProps | undefined>(undefined);

export function ChatConvertionsProvider({ children }: { children: React.ReactNode }) {
    const [conversation, setConversation] = useState<Conversation>({
        id: 'conv_001',
        history: [],
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [roomTitle, setRoomTitle] = useState('New Chat');

    useEffect(() => {
        loadInitialMessages();
    }, []);

    const loadInitialMessages = async () => {
        try {
            const response = await fetch(`/api/messages?page=${1}`);
            const data = await response.json();
            setConversation((prev) => ({
                ...prev,
                history: data.messages,
            }));
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error loading initial messages:', error);
        }
    };

    const loadMoreMessages = async () => {
        try {
            const nextPage = page + 1;
            const response = await fetch(`/api/messages?page=${nextPage}`);
            const data = await response.json();
            
            setConversation((prev) => ({
                ...prev,
                history: [...data.messages, ...prev.history],
            }));
            setPage(nextPage);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error loading more messages:', error);
        }
    };

    const sendMessage = async (text: string) => {
        const userMsg: Message = {
            role: 'user', text,
            id: undefined,
            history: undefined
        };
        setConversation((prev) => ({
            ...prev,
            history: [...prev.history, userMsg],
        }));

        if (conversation.history.length === 0) {
            setRoomTitle(text.slice(0, 30));
        }

        const modelThinking = { role: 'model', text: '...' };
        setConversation((prev) => ({
            ...prev,
            history: [...prev.history, userMsg, modelThinking] as Message[],
        }));

        const response = await simulateAiResponse(`You said: ${text}`);
        setConversation((prev) => {
            const updated = [...prev.history];
            updated[updated.length - 1] = { role: 'model', text: response, id: Date.now(), history: [] };
            return { ...prev, history: updated };
        });
    };

    return (
        <ChatConvertionsContext.Provider value={{ conversation, sendMessage, roomTitle, loadMoreMessages, hasMore }}>
            {children}
        </ChatConvertionsContext.Provider>
    );
}

export const useChatConvertionsContext = () => {
    const context = useContext(ChatConvertionsContext);
    if (!context) throw new Error('ChatConvertionsContext missing');
    return context;
};
