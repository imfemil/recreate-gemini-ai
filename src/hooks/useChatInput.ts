'use client';

import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useChatInput() {
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { activeRoomId, sendMessage, receiveAIMessage } = useAppStore();

    const handleSendMessage = useCallback(async (text?: string) => {
        const messageText = text || inputValue.trim();

        if (!activeRoomId || isThinking || !messageText) return;

        // Clear any existing throttle
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }

        // Clear input immediately
        setInputValue('');

        // Throttle to prevent spam
        throttleTimeoutRef.current = setTimeout(async () => {
            setIsThinking(true);

            try {
                // Send user message
                sendMessage(messageText);

                // Simulate AI thinking time
                const thinkingTime = Math.random() * 2000 + 1000;
                await new Promise(resolve => setTimeout(resolve, thinkingTime));

                // Get AI response (you can replace this with actual API call)
                const aiResponse = `You said: "${messageText}". This is a simulated AI response.`;
                receiveAIMessage(aiResponse);

            } catch (error) {
                console.error('Error sending message:', error);
                receiveAIMessage('Sorry, I encountered an error. Please try again.');
            } finally {
                setIsThinking(false);
            }
        }, 300); // 300ms throttle
    }, [inputValue, activeRoomId, isThinking, sendMessage, receiveAIMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    return {
        inputValue,
        setInputValue,
        isThinking,
        handleSendMessage,
        handleKeyPress,
        canSend: !isThinking && inputValue.trim().length > 0 && activeRoomId
    };
}