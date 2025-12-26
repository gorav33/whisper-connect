interface TypingIndicatorProps {
  username?: string;
}

const TypingIndicator = ({ username }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
      <div className="flex items-center gap-1 bg-chat-received rounded-2xl rounded-bl-md px-4 py-3">
        <span className="typing-dot w-2 h-2 bg-chat-typing rounded-full" />
        <span className="typing-dot w-2 h-2 bg-chat-typing rounded-full" />
        <span className="typing-dot w-2 h-2 bg-chat-typing rounded-full" />
      </div>
      {username && (
        <span className="text-xs text-muted-foreground">
          {username} is typing...
        </span>
      )}
    </div>
  );
};

export default TypingIndicator;
