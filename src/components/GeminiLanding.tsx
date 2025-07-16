// components/GeminiLanding.tsx
'use client';

import { useAppStore } from "@/store/useAppStore";

export default function GeminiLanding() {
     const { name} = useAppStore();
    return (
        <div className="min-h-[65vh] flex flex-col items-center justify-center relative bg-[var(--background)]">
            <h1 className="text-2xl sm:text-3xl  mt-6 sm:mt-8 md:mt-10 font-semibold text-center transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] px-4 sm:px-6 md:px-8">Hello, {name ? name : "Femil"}</h1>
        </div>
    );
}
