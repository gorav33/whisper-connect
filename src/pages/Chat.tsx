import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import { cn } from '@/lib/utils';

const ChatContent = () => {
  const { activeChat } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);

  // On mobile, switch between sidebar and chat area
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChatSelect = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar - hidden on mobile when chat is active */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 shrink-0 h-full',
          !showSidebar && 'hidden md:block'
        )}
      >
        <Sidebar onChatSelect={handleChatSelect} />
      </div>

      {/* Chat Area - hidden on mobile when sidebar is visible */}
      <div
        className={cn(
          'flex-1 h-full',
          showSidebar && !activeChat && 'hidden md:flex'
        )}
      >
        <ChatArea onBack={handleBack} showBackButton={true} />
      </div>
    </div>
  );
};

const Chat = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;
