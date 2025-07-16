'use client';

import { showToast } from '@/lib/toast';
import { useAppStore } from '@/store/useAppStore';
import { Menu, SquarePenIcon, Trash2, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatSidebar({ setSidebarCollapsed }: { setSidebarCollapsed: (collapsed: boolean) => void }) {
    const router = useRouter();
    const { rooms, createRoom, deleteRoom } = useAppStore();
    const [collapsed, setCollapsed] = useState(false);
    const [manualOpen, setManualOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const params = useParams();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth > 1024) {
                setCollapsed(false);
                setManualOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCreateRoom = async () => {
        const name = prompt('Enter chatroom name:')?.trim();
        if (!name) {
            showToast('Chatroom name is required', 'error');
            return;
        }
        const roomId = createRoom(name);
        showToast(`Chatroom "${name}" created`, 'success');
        router.push(`/dashboard/${roomId}`);
    };

    const toggleSidebar = () => {
        setManualOpen(!manualOpen);
        setCollapsed(!collapsed);
        setSidebarCollapsed(collapsed);
    };

    const isCollapsed = (!manualOpen && collapsed) || (isMobile && !manualOpen);

    const filteredRooms = rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full">
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 cursor-pointer z-40"
                    onClick={toggleSidebar}
                />
            )}
            <aside
                className={`h-full bg-[var(--sidebar)] backdrop-blur-lg transition-all duration-300 shadow-lg fixed md:relative
                ${isCollapsed ? 'w-[64px]' : 'w-[280px]'}`}
                onMouseEnter={() => !isMobile && !manualOpen && setCollapsed(false)}
                onMouseLeave={() => !isMobile && !manualOpen && setCollapsed(true)}
            >
                <div className="p-3 space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold text-[var(--foreground)] transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            Search Chat
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            title="Toggle Sidebar"
                            className="p-3 rounded-full hover:bg-[var(--background)] transition-all duration-200 cursor-pointer"
                        >
                            <Menu size={20} className="text-[var(--foreground)]" />
                        </button>
                    </div>
                    {!isCollapsed && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 pl-8 rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                            />
                            <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    )}
                    <ul className="space-y-0.5 flex-1 h-[80vh] overflow-y-auto">
                        <li>
                            <button
                                onClick={handleCreateRoom}
                                title="New Chat"
                                className={`w-full flex items-center p-2.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] cursor-pointer transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <SquarePenIcon className="min-w-[20px]" size={20} />
                                <span className={`ml-2 truncate transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>New Chat</span>
                            </button>
                        </li>
                        {!isCollapsed && filteredRooms?.length > 0 && <li className="px-2.5 mt-5">
                            <span className="text-sm text-gray-500 font-semibold">
                                Recent
                            </span>
                        </li>}
                        {!isCollapsed && filteredRooms.map((room) => (
                            <li
                                key={room.id}
                                className="group/item"
                            >
                                <div 
                                    onClick={() => router.push(`/dashboard/${room.id}`)}
                                    className={`w-full flex items-center p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-opacity-90 ${
                                        params?.roomId === room.id 
                                            ? 'bg-blue-900/20 dark:bg-blue-900/20' 
                                            : 'hover:bg-[var(--background)] text-[var(--foreground)]'
                                    }`}
                                >
                                    <span className={`ml-2 truncate capitalize font-medium text-sm flex-1 ${params?.roomId === room.id ? 'text-blue-800 dark:text-blue-600 font-semibold' : 'text-[var(--foreground)]'}`}>
                                        {room.name}
                                    </span>
                                    <button
                                        className="ml-2 p-1.5 rounded-md text-[var(--foreground)] opacity-0 group-hover/item:opacity-100 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            deleteRoom(room.id);
                                            showToast('Chatroom deleted', 'success');
                                        }}
                                        title="Delete chat"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
