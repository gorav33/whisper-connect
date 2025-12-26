import { User, Message, Chat } from '@/types/chat';

const STORAGE_KEYS = {
  USER: 'chat_user',
  CHATS: 'chat_chats',
  MESSAGES: 'chat_messages',
  DEMO_USERS: 'chat_demo_users',
};

// User storage
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (!data) return null;
  const user = JSON.parse(data);
  return { ...user, lastSeen: new Date(user.lastSeen) };
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Chats storage
export const saveChats = (chats: Chat[]): void => {
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
};

export const getChats = (): Chat[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CHATS);
  if (!data) return [];
  return JSON.parse(data).map((chat: Chat) => ({
    ...chat,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
    lastMessage: chat.lastMessage
      ? { ...chat.lastMessage, timestamp: new Date(chat.lastMessage.timestamp) }
      : undefined,
    participants: chat.participants.map((p: User) => ({
      ...p,
      lastSeen: new Date(p.lastSeen),
    })),
  }));
};

// Messages storage
export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const getMessages = (): Message[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!data) return [];
  return JSON.parse(data).map((msg: Message) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
};

export const addMessage = (message: Message): void => {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
};

// Demo users storage
export const saveDemoUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.DEMO_USERS, JSON.stringify(users));
};

export const getDemoUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DEMO_USERS);
  if (!data) return [];
  return JSON.parse(data).map((user: User) => ({
    ...user,
    lastSeen: new Date(user.lastSeen),
  }));
};

// Clear all data
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
