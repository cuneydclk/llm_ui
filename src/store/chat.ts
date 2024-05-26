import { create } from "zustand";
import { v4 } from 'uuid';
import store from "store2";

export interface UseChatProps {
    chat: Chat[],
    selectedChat: Chat | undefined,
    setChat: (payload: Chat) => void,
    addChat: (callback?: (id: string) => void) => void,
    editChat: (id: string, payload: Partial<Chat>) => void,
    addMessage: (id: string, action: ChatContent) => void,
    setSelectedChat: (payload: { id: string }) => void,
    removeChat: (payload: { id: string }) => void,
    clearAll: () => void,
};

type Chat = {
    id: string,
    role: string,
    content: ChatContent[]
};

type ChatContent = {
    emitter: ChatContentEmmiter,
    message: string
};

type ChatContentEmmiter = "gpt" | "user" | "error";

// Fetch chats for the given user ID from the server
const fetchUserChats = async (userId: string): Promise<Chat[] | undefined> => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/users/${userId}/chats`);
        if (!response.ok) {
            throw new Error('Failed to fetch user chats');
        }
        const data = await response.json();
        return data.chats;
    } catch (error) {
        console.error('Error fetching user chats:', error);
        return undefined;
    }
};


// Initialize initial chat state with fetched user chats or a new chat if no chats are fetched
const initializeChatState = async (userId: string): Promise<Chat[]> => {
    const userChats = await fetchUserChats(userId);
    if (userChats) {
        return userChats.map(chat => ({
            id: chat.session_id,
            role: chat.subject,
            content: [{ emitter: 'user', message: chat.subject }]
        }));
    } else {
        // If no chats are fetched, return an empty array with a new chat
        const newChatId = v4();
        return [{
            id: newChatId,
            role: "How to use BetterBook",
            content: [{ emitter: 'user', message: 'Write your desire and I will help' }]
        }];
    }
};
const savedChats = JSON.parse(store.session("@chat"));
const getSafeSavedChats = () => {
    if (Array.isArray(savedChats) && savedChats.length > 0) {
        return savedChats;
    };

    return undefined;
};

const initialChatState: Chat[] = getSafeSavedChats() || [
    {
        id: '1',
        role: 'About this website',
        content: [
            {
                emitter: "user",
                message: "What website is this?"
            },
            {
                emitter: "gpt",
                message: "This website is a assistant for hotel reservation. Powered by OpenAI."
            }
        ],
    },
    {
        
    }
];

export const useChat = create<UseChatProps>((set, get) => ({
    chat: [],
    selectedChat: undefined,
    setChat: (payload) => set(({ chat }) => ({ chat: [...chat, payload] })),
    addChat: async (callback) => {
        const hasNewChat = get().chat.find(({ content }) => (content.length === 0));

        if (!hasNewChat) {
            const id = v4()
            get().setChat({
                role: "New chat",
                id: id,
                content: []
            });
            get().setSelectedChat({ id });
            if (callback) callback(id);
        } else {
            const { id } = hasNewChat;
            get().setSelectedChat({ id });
            if (callback) callback(id);
        };
    },
    editChat: async (id, payload) => set(({ chat }) => {
        const selectedChat = chat.findIndex((query) => (query.id === id));
        if (selectedChat > -1) {
            chat[selectedChat] = { ...chat[selectedChat], ...payload };
            return ({ chat, selectedChat: chat[selectedChat] })
        };
        return ({});

    }),
    addMessage: async (id, action) => set(({ chat }) => {
        const selectedChat = chat.findIndex((query) => (query.id === id)),
            props = chat[selectedChat];

        if (selectedChat > -1) {
            chat[selectedChat] = { ...props, content: [...props['content'], action] }
            return ({ chat, selectedChat: chat[selectedChat] });
        };

        return ({});
    }),
    setSelectedChat: async (payload) => set(({ chat }) => {
        const selectedChat = chat.find(({ id }) => id === payload.id);
        return ({ selectedChat: selectedChat })
    }),
    removeChat: async (payload) => set(({ chat }) => {
        const newChat = chat.filter(({ id }) => id !== payload.id);
        return ({ chat: newChat });
    }),
    clearAll: async () => set({ chat: [], selectedChat: undefined })
}));

// Fetch user ID from sessionStorage and initialize chat state
const userId = sessionStorage.getItem('userId');
if (userId) {
    initializeChatState(userId).then(chats => useChat.setState({ chat: chats }));
}