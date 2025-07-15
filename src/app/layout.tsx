import { ChatConvertionsProvider } from "@/context/ChatConvertionsContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "../style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Gemini AI - Recreation",
  description: "A powerful AI chat application powered by Google's Gemini AI, developed by Femil Patodiya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressContentEditableWarning={true}
      >
        <Toaster position="top-center" richColors />
        <ChatConvertionsProvider>
          {children}
        </ChatConvertionsProvider>
      </body>
    </html>
  );
}
