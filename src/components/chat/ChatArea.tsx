import { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import UserStatus from './UserStatus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

interface ChatAreaProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatArea = ({ onBack, showBackButton = false }: ChatAreaProps) => {
  const { activeChat, messages, typingUsers, sendMessage, setTyping, markMessagesAsRead, getOtherParticipant } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = activeChat ? getOtherParticipant(activeChat) : null;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when viewing the chat
  useEffect(() => {
    if (activeChat) {
      markMessagesAsRead(activeChat.id);
    }
  }, [activeChat, markMessagesAsRead]);

  const isOtherTyping = activeChat && typingUsers.some(
    t => t.chatId === activeChat.id && t.userId !== user?.id && t.isTyping
  );

  if (!activeChat || !otherParticipant) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            Select a conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {otherParticipant.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <UserStatus
            isOnline={otherParticipant.isOnline}
            size="md"
            className="absolute -bottom-0.5 -right-0.5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground truncate">
            {otherParticipant.username}
          </h2>
          <p className="text-xs text-muted-foreground">
            {otherParticipant.isOnline
              ? 'Online'
              : `Last seen ${format(new Date(otherParticipant.lastSeen), 'MMM d, h:mm a')}`}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              No messages yet. Say hello! 👋
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSent={message.senderId === user?.id}
            />
          ))
        )}
        {isOtherTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} onTyping={setTyping} />
    </div>
  );
};

export default ChatArea;
