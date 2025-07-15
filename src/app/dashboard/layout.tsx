// app/dashboard/page.tsx
'use client';

import AiInputBar from '@/components/AiInputBar';
import ChatSidebar from '@/components/ChatSidebar';
import TopbarUser from '@/components/TopbarUser';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isLoggedIn = useAppStore((state) => state.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    return (
        <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
            <motion.div
                className="h-full z-50"
                initial={{ width: '280px' }}
                animate={{
                    width: isSidebarCollapsed ? '64px' : '280px',
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <ChatSidebar setSidebarCollapsed={setSidebarCollapsed} />
            </motion.div>
            <motion.div
                className="flex flex-col flex-1 w-full relative"
                initial={{ marginLeft: 0 }}
                animate={{ marginLeft: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <header className="h-16 bg-[var(--background)] sticky top-0 z-10">
                    <div className="flex items-center h-full px-6">
                        <Link href={'/dashboard'} className="text-xl font-medium text-[var(--foreground)] opacity-80">Gemini</Link>
                        <div className="ml-auto">
                            <TopbarUser />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto py-6">
                    <div className="w-[95%] max-w-3xl mx-auto">
                        <div className='backdrop-blur-sm bg-[var(--background)]/80 rounded-lg p-6'>
                            {children}
                        </div>
                    </div>
                </main>

                <footer className="sticky bottom-0 py-4 bg-[var(--background)]">
                    <div className="w-[95%] max-w-3xl mx-auto">
                        <div className="">
                            <AiInputBar />
                        </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">Gemini can make mistakes, so double-check it</p>
                </footer>
            </motion.div>
        </div>
    );
}
