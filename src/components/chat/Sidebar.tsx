import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserStatus from './UserStatus';
import { MessageCircle, Search, Settings, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { useState } from 'react';

interface SidebarProps {
  onChatSelect?: () => void;
}

const Sidebar = ({ onChatSelect }: SidebarProps) => {
  const { chats, activeChat, setActiveChat, getOtherParticipant } = useChat();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat);
    onChatSelect?.();
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(chat);
    return other?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort chats by last message time
  const sortedChats = [...filteredChats].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || a.updatedAt;
    const bTime = b.lastMessage?.timestamp || b.updatedAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">Chats</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-sidebar-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-sidebar-accent border-sidebar-border"
          />
        </div>
      </div>

      {/* Current User */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <UserStatus isOnline={true} size="sm" className="absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.username || 'You'}
            </p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedChats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            sortedChats.map((chat) => {
              const other = getOtherParticipant(chat);
              if (!other) return null;

              const isActive = activeChat?.id === chat.id;
              const lastMessage = chat.lastMessage;
              const hasUnread = chat.unreadCount > 0;

              return (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                    isActive
                      ? 'bg-sidebar-accent'
                      : 'hover:bg-sidebar-accent/50'
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={other.avatar} alt={other.username} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {other.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <UserStatus
                      isOnline={other.isOnline}
                      size="md"
                      className="absolute -bottom-0.5 -right-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-sm truncate',
                          hasUnread
                            ? 'font-semibold text-sidebar-foreground'
                            : 'font-medium text-sidebar-foreground'
                        )}
                      >
                        {other.username}
                      </span>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {format(new Date(lastMessage.timestamp), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          'text-xs truncate flex-1',
                          hasUnread
                            ? 'text-sidebar-foreground font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        {lastMessage?.content || 'Start a conversation'}
                      </p>
                      {hasUnread && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
