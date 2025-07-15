'use client';

import ChatMessages from '@/components/ChatMessages';
import { useAppStore } from '@/store/useAppStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
    const params = useParams();
    const setActiveRoom = useAppStore((state) => state.setActiveRoom);

    useEffect(() => {
        if (params.roomId) {
            setActiveRoom(params.roomId as string);
        }
    }, [params.roomId, setActiveRoom]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
            <ChatMessages />
        </div>
    );
}
