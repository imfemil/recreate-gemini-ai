// components/TopbarUser.tsx
import { useThemes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import Cookies from 'js-cookie';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { LogOutIcon, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TopbarUser() {
    const router = useRouter();
    const logout = useAppStore((s) => s.logout);
    const { theme, toggleTheme } = useThemes();
    const [mounted, setMounted] = useState(false);
    const { name, phone } = useAppStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="absolute top-4 right-4 flex items-center space-x-3">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-[var(--sidebar)] hover:bg-opacity-80 transition duration-200 cursor-pointer"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {theme === 'dark' ?
                    <Sun className="w-5 h-5 text-[var(--foreground)]" /> :
                    <Moon className="w-5 h-5 text-[var(--foreground)]" />
                }
            </button>
            <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="w-8 h-8 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center font-semibold shadow-lg cursor-pointer">
                    {name?.[0] || 'U'}
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right bg-[var(--sidebar)] rounded-md shadow-lg p-2 ring-1 ring-black/5 focus:outline-none z-50 dark:ring-white/5">
                    <div className="px-4 py-2 hover:bg-[var(--background)] hover:bg-opacity-50 rounded-md transition-colors duration-150">
                        <p className="text-sm font-medium text-[var(--foreground)]">{name}</p>
                        <p className="text-sm text-[var(--foreground)] opacity-75">patodiafemil@gmail.com</p>
                        {phone && <p className="text-sm text-[var(--foreground)] opacity-75">{phone}</p>}
                    </div>
                    <div
                        onClick={() => {
                            Cookies.remove('easy-chat-store')
                            logout();
                            router.push('/login');
                        }}
                        className="flex items-center px-4 py-2 hover:bg-[var(--background)] hover:bg-opacity-50 rounded-md transition-colors duration-150 cursor-pointer"
                    >
                        <LogOutIcon className="w-4 h-4 mr-2 text-[var(--foreground)]" />
                        <span className="text-sm text-[var(--foreground)]">Logout</span>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}