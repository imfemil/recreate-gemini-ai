'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-200 via-purple-100 to-indigo-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-purple-100 transition-all duration-300">
                <div>
                    <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Welcome to Gemini AI
                    </h2>
                    <p className="text-center text-gray-600 text-sm font-medium mb-8">
                        Experience the future of AI with secure verification
                    </p>
                    <p className="text-center text-gray-600 mb-8 px-4">
                        Join us to explore the cutting-edge AI technology and discover endless possibilities. Sign in to your account or create a new one to get started.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                        href="/login" 
                        className="w-full sm:w-auto px-8 py-3 text-center text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-200"
                    >
                        Sign In
                    </Link>
                    <Link 
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-3 text-center text-sm font-semibold rounded-xl text-purple-600 bg-white border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-200"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
