export interface Message {
    id: unknown;
    history: unknown;
    role: 'user' | 'model';
    text: string;
}

export interface Conversation {
    id: string;
    history: Message[];
}
