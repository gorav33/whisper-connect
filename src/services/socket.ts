/**
 * Socket Service
 * 
 * This file sets up the Socket.IO client connection.
 * Currently contains placeholder/mock implementations.
 * 
 * When your Node.js backend is ready:
 * 1. npm install socket.io-client
 * 2. Uncomment the socket.io-client code below
 * 3. Update SOCKET_URL to point to your backend
 */

import { Message, TypingStatus } from '@/types/chat';

// Configure your socket server URL here when ready
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

type MessageHandler = (message: Message) => void;
type TypingHandler = (status: TypingStatus) => void;
type StatusHandler = (userId: string, isOnline: boolean) => void;

class SocketService {
  private messageHandlers: MessageHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private statusHandlers: StatusHandler[] = [];
  private connected = false;

  connect(userId: string): void {
    // TODO: Implement actual Socket.IO connection
    // import { io } from 'socket.io-client';
    // this.socket = io(SOCKET_URL, {
    //   auth: { userId },
    // });
    // 
    // this.socket.on('message', (message: Message) => {
    //   this.messageHandlers.forEach(handler => handler(message));
    // });
    // 
    // this.socket.on('typing', (status: TypingStatus) => {
    //   this.typingHandlers.forEach(handler => handler(status));
    // });
    // 
    // this.socket.on('userStatus', ({ userId, isOnline }) => {
    //   this.statusHandlers.forEach(handler => handler(userId, isOnline));
    // });

    console.log('Socket: Connected with userId', userId, 'to', SOCKET_URL);
    this.connected = true;
  }

  disconnect(): void {
    // TODO: this.socket?.disconnect();
    console.log('Socket: Disconnected');
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Send a message through socket
  sendMessage(chatId: string, content: string): void {
    // TODO: this.socket?.emit('message', { chatId, content });
    console.log('Socket: Send message', { chatId, content });
  }

  // Emit typing status
  sendTypingStatus(chatId: string, isTyping: boolean): void {
    // TODO: this.socket?.emit('typing', { chatId, isTyping });
    console.log('Socket: Typing status', { chatId, isTyping });
  }

  // Join a chat room
  joinChat(chatId: string): void {
    // TODO: this.socket?.emit('joinChat', chatId);
    console.log('Socket: Joined chat', chatId);
  }

  // Leave a chat room
  leaveChat(chatId: string): void {
    // TODO: this.socket?.emit('leaveChat', chatId);
    console.log('Socket: Left chat', chatId);
  }

  // Event handlers
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: TypingHandler): () => void {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  onUserStatus(handler: StatusHandler): () => void {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  }

  // Simulate receiving a message (for demo purposes)
  simulateIncomingMessage(message: Message): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  // Simulate typing status (for demo purposes)
  simulateTyping(status: TypingStatus): void {
    this.typingHandlers.forEach(handler => handler(status));
  }
}

export const socketService = new SocketService();
