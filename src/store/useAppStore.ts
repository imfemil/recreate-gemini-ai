import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[];  // Array of image URLs
  timestamp: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  // Auth
  isLoggedIn: boolean;
  phone?: string;
  name?: string;
  login: (payload: { phone: string; name: string }) => void;
  logout: () => void;

  // Chat
  rooms: ChatRoom[];
  activeRoomId?: string;
  isThinking: boolean;

  createRoom: (name: string) => string;
  deleteRoom: (id: string) => void;
  setActiveRoom: (id: string) => void;
  sendMessage: (text: string, images?: string[]) => void;
  receiveAIMessage: (text: string, images?: string[]) => void;
  updateThinkingState: (isThinking: boolean) => void;
  resetChat: () => void;
  
  // Infinite scroll
  loadMoreMessages: (roomId: string, page: number) => Promise<{ messages: Message[], hasMore: boolean }>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isLoggedIn: false,
      phone: undefined,
      name: undefined,
      login: ({ phone, name }) => set({ isLoggedIn: true, phone, name }),
      logout: () =>
        set({
          isLoggedIn: false,
          phone: undefined,
          name: undefined,
          rooms: [],
          activeRoomId: undefined,
          isThinking: false,
        }),

      // Chat
      rooms: [],
      activeRoomId: undefined,
      isThinking: false,

      createRoom: (name) => {
        const id = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newRoom: ChatRoom = { 
          id, 
          name: name || `Chat ${get().rooms.length + 1}`, 
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set((state) => ({
          rooms: [newRoom, ...state.rooms], // Add new room at the beginning
          activeRoomId: id,
        }));
        
        return id;
      },

      deleteRoom: (id) =>
        set((state) => {
          const updatedRooms = state.rooms.filter((room) => room.id !== id);
          const newActiveRoomId =
            state.activeRoomId === id ? updatedRooms[0]?.id : state.activeRoomId;
          return {
            rooms: updatedRooms,
            activeRoomId: newActiveRoomId,
          };
        }),

      setActiveRoom: (id) => set({ activeRoomId: id, isThinking: false }),

      sendMessage: (text, images) => {
        const { activeRoomId, rooms } = get();
        if (!activeRoomId) return;

        const userMessage: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'user',
          text: text.trim(),
          images: images,
          timestamp: Date.now()
        };

        const thinkingMessage: Message = {
          id: `thinking_${Date.now()}`,
          role: 'model',
          text: '...',
          timestamp: Date.now()
        };

        const updatedRooms = rooms.map((room) =>
          room.id === activeRoomId
            ? {
                ...room,
                messages: [...room.messages, userMessage, thinkingMessage],
                updatedAt: Date.now()
              }
            : room
        );

        set({ rooms: updatedRooms, isThinking: true });
      },

      receiveAIMessage: (text, images) => {
        const { activeRoomId, rooms } = get();
        if (!activeRoomId) return;

        const aiMessage: Message = {
          id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          role: 'model',
          text,
          images: images,
          timestamp: Date.now()
        };

        const updatedRooms = rooms.map((room) => {
          if (room.id !== activeRoomId) return room;
          
          const updatedMessages = [...room.messages];
          const lastMessageIndex = updatedMessages.length - 1;
          const lastMessage = updatedMessages[lastMessageIndex];
          
          // Replace thinking message with actual AI response
          if (lastMessage?.role === 'model' && lastMessage.text === '...') {
            updatedMessages[lastMessageIndex] = aiMessage;
          } else {
            updatedMessages.push(aiMessage);
          }
          
          return { 
            ...room, 
            messages: updatedMessages,
            updatedAt: Date.now()
          };
        });

        set({ rooms: updatedRooms, isThinking: false });
      },

      updateThinkingState: (isThinking) => set({ isThinking }),

      resetChat: () => set({ rooms: [], activeRoomId: undefined, isThinking: false }),

      // Simulate infinite scroll API
      loadMoreMessages: async (roomId: string, page: number) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate dummy historical messages
        const dummyMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: `historical_${page}_${i}`,
          role: (i % 2 === 0 ? 'user' : 'model') as 'user' | 'model',
          text: `Historical message ${page}-${i + 1}: ${i % 2 === 0 ? 'User message' : 'AI response'}`,
          images: i % 3 === 0 ? [`dummy-image-${i}.jpg`] : undefined,
          timestamp: Date.now() - (page * 10 + i) * 60000 // Messages from the past
        }));

        // Simulate pagination
        const hasMore = page < 5; // Limit to 5 pages for demo

        return { messages: dummyMessages, hasMore };
      },
    }),
    {
      name: 'easy-chat-store',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
