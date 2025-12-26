import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showTimestamp?: boolean;
}

const MessageBubble = ({ message, isSent, showTimestamp = true }: MessageBubbleProps) => {
  const getStatusIcon = () => {
    if (!isSent) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-chat-sent-foreground/70" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-chat-sent-foreground/70" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex animate-message-in',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5',
          isSent ? 'message-bubble-sent' : 'message-bubble-received'
        )}
      >
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isSent ? 'justify-end' : 'justify-start'
          )}
        >
          {showTimestamp && (
            <span
              className={cn(
                'text-[10px]',
                isSent ? 'text-chat-sent-foreground/70' : 'text-muted-foreground'
              )}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          )}
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
