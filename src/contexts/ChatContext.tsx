import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Chat, Message, ChatState, TypingStatus } from '@/types/chat';
import { socketService } from '@/services/socket';
import { useAuth } from './AuthContext';
import { getChats, saveChats, getMessages, saveMessages, getDemoUsers } from '@/lib/storage';
import { generateAutoReply } from '@/lib/mockData';

interface ChatContextType extends ChatState {
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => void;
  setTyping: (isTyping: boolean) => void;
  markMessagesAsRead: (chatId: string) => void;
  getOtherParticipant: (chat: Chat) => { id: string; username: string; avatar?: string; isOnline: boolean; lastSeen: Date } | null;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chats and messages from localStorage
  useEffect(() => {
    if (user) {
      const storedChats = getChats();
      const storedMessages = getMessages();
      
      // Update last messages for chats
      const chatsWithLastMessages = storedChats.map(chat => {
        const chatMessages = storedMessages
          .filter(m => m.chatId === chat.id)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        return {
          ...chat,
          lastMessage: chatMessages[0],
        };
      });
      
      setChats(chatsWithLastMessages);
      setMessages(storedMessages);
      setIsLoading(false);
    }
  }, [user]);

  // Subscribe to socket events
  useEffect(() => {
    const unsubMessage = socketService.onMessage((message) => {
      setMessages(prev => {
        const updated = [...prev, message];
        saveMessages(updated);
        return updated;
      });
      
      setChats(prev => {
        const updated = prev.map(chat => 
          chat.id === message.chatId 
            ? { ...chat, lastMessage: message, updatedAt: new Date() }
            : chat
        );
        saveChats(updated);
        return updated;
      });
    });

    const unsubTyping = socketService.onTyping((status) => {
      setTypingUsers(prev => {
        if (status.isTyping) {
          return [...prev.filter(t => t.userId !== status.userId), status];
        }
        return prev.filter(t => t.userId !== status.userId);
      });
    });

    return () => {
      unsubMessage();
      unsubTyping();
    };
  }, []);

  const setActiveChat = useCallback((chat: Chat | null) => {
    if (activeChat) {
      socketService.leaveChat(activeChat.id);
    }
    if (chat) {
      socketService.joinChat(chat.id);
    }
    setActiveChatState(chat);
  }, [activeChat]);

  const sendMessage = useCallback((content: string) => {
    if (!activeChat || !user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: user.id,
      content,
      timestamp: new Date(),
      status: 'sent',
    };

    // Add message locally
    setMessages(prev => {
      const updated = [...prev, newMessage];
      saveMessages(updated);
      return updated;
    });

    // Update chat's last message
    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === activeChat.id
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
          : chat
      );
      saveChats(updated);
      return updated;
    });

    // Send via socket (when backend is ready)
    socketService.sendMessage(activeChat.id, content);

    // Simulate message status change to delivered
    setTimeout(() => {
      setMessages(prev => {
        const updated = prev.map(m =>
          m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
        );
        saveMessages(updated);
        return updated;
      });
    }, 500);

    // Simulate auto-reply from the other participant
    const otherParticipant = activeChat.participants.find(p => p.id !== user.id);
    if (otherParticipant?.isOnline) {
      // Show typing indicator
      const typingStatus: TypingStatus = {
        chatId: activeChat.id,
        userId: otherParticipant.id,
        isTyping: true,
      };
      socketService.simulateTyping(typingStatus);

      // Send auto-reply after delay
      setTimeout(() => {
        socketService.simulateTyping({ ...typingStatus, isTyping: false });
        const reply = generateAutoReply(activeChat.id, otherParticipant.id);
        socketService.simulateIncomingMessage(reply);
      }, 1500 + Math.random() * 2000);
    }
  }, [activeChat, user]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!activeChat) return;
    socketService.sendTypingStatus(activeChat.id, isTyping);
  }, [activeChat]);

  const markMessagesAsRead = useCallback((chatId: string) => {
    setMessages(prev => {
      const updated = prev.map(m =>
        m.chatId === chatId && m.senderId !== user?.id
          ? { ...m, status: 'read' as const }
          : m
      );
      saveMessages(updated);
      return updated;
    });

    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      );
      saveChats(updated);
      return updated;
    });
  }, [user?.id]);

  const getOtherParticipant = useCallback((chat: Chat) => {
    if (!user) return null;
    const other = chat.participants.find(p => p.id !== user.id);
    if (!other) return null;
    
    // Get updated status from demo users
    const demoUsers = getDemoUsers();
    const demoUser = demoUsers.find(u => u.id === other.id);
    
    return demoUser || other;
  }, [user]);

  const activeChatMessages = activeChat
    ? messages.filter(m => m.chatId === activeChat.id)
    : [];

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages: activeChatMessages,
        typingUsers,
        isLoading,
        setActiveChat,
        sendMessage,
        setTyping,
        markMessagesAsRead,
        getOtherParticipant,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
