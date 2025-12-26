import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '@/types/chat';
import { authApi } from '@/services/api';
import { socketService } from '@/services/socket';
import { saveUser, getUser, removeUser, saveDemoUsers, getDemoUsers, saveChats, getChats, saveMessages, getMessages } from '@/lib/storage';
import { createDemoUsers, createInitialChats, createInitialMessages } from '@/lib/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      socketService.connect(storedUser.id);
    }
    setIsLoading(false);
  }, []);

  const initializeDemoData = useCallback((currentUser: User) => {
    // Check if demo data already exists
    let demoUsers = getDemoUsers();
    if (demoUsers.length === 0) {
      demoUsers = createDemoUsers();
      saveDemoUsers(demoUsers);
    }

    // Check if chats exist
    let chats = getChats();
    if (chats.length === 0) {
      chats = createInitialChats(currentUser, demoUsers);
      saveChats(chats);
    }

    // Check if messages exist
    let messages = getMessages();
    if (messages.length === 0) {
      messages = createInitialMessages(chats, currentUser.id);
      saveMessages(messages);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authApi.login(email, password);
      setUser(loggedInUser);
      saveUser(loggedInUser);
      socketService.connect(loggedInUser.id);
      initializeDemoData(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: newUser } = await authApi.register(username, email, password);
      setUser(newUser);
      saveUser(newUser);
      socketService.connect(newUser.id);
      initializeDemoData(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeUser();
    socketService.disconnect();
    authApi.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
