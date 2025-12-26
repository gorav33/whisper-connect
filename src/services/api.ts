/**
 * API Service Layer
 * 
 * This file contains all API calls that would connect to your Node.js backend.
 * Currently returns mock data. Replace the implementations with actual fetch/axios calls
 * when your backend is ready.
 * 
 * Example backend endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - GET /api/chats
 * - GET /api/chats/:chatId/messages
 * - POST /api/chats/:chatId/messages
 */

import { User, Chat, Message } from '@/types/chat';

// Configure your backend URL here when ready
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const headers = {
  'Content-Type': 'application/json',
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers,
    //   body: JSON.stringify({ email, password }),
    // });
    // return response.json();
    
    console.log('API: Login called with', { email, password, API_BASE_URL });
    
    // Mock implementation
    const user: User = {
      id: `user-${Date.now()}`,
      username: email.split('@')[0],
      email,
      isOnline: true,
      lastSeen: new Date(),
    };
    
    return { user, token: 'mock-jwt-token' };
  },

  register: async (username: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    // TODO: Replace with actual API call
    console.log('API: Register called with', { username, email, password });
    
    const user: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      isOnline: true,
      lastSeen: new Date(),
    };
    
    return { user, token: 'mock-jwt-token' };
  },

  logout: async (): Promise<void> => {
    // TODO: Replace with actual API call
    console.log('API: Logout called');
  },
};

// Chats API
export const chatsApi = {
  getChats: async (): Promise<Chat[]> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/chats`, { headers });
    // return response.json();
    
    console.log('API: Get chats called');
    return [];
  },

  createChat: async (participantIds: string[]): Promise<Chat> => {
    console.log('API: Create chat called with', { participantIds });
    
    // Mock implementation
    return {
      id: `chat-${Date.now()}`,
      participants: [],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

// Messages API
export const messagesApi = {
  getMessages: async (chatId: string): Promise<Message[]> => {
    // TODO: Replace with actual API call
    console.log('API: Get messages called for chat', chatId);
    return [];
  },

  sendMessage: async (chatId: string, content: string): Promise<Message> => {
    // TODO: Replace with actual API call
    console.log('API: Send message called', { chatId, content });
    
    return {
      id: `msg-${Date.now()}`,
      chatId,
      senderId: '',
      content,
      timestamp: new Date(),
      status: 'sent',
    };
  },

  markAsRead: async (chatId: string, messageIds: string[]): Promise<void> => {
    console.log('API: Mark as read called', { chatId, messageIds });
  },
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    console.log('API: Get users called');
    return [];
  },

  updateStatus: async (isOnline: boolean): Promise<void> => {
    console.log('API: Update status called', { isOnline });
  },
};
