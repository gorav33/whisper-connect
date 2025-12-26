import { User, Chat, Message } from '@/types/chat';

export const createDemoUsers = (): User[] => [
  {
    id: 'demo-1',
    username: 'Sarah Chen',
    email: 'sarah@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: 'demo-2',
    username: 'Alex Rivera',
    email: 'alex@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: 'demo-3',
    username: 'Jordan Park',
    email: 'jordan@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    isOnline: true,
    lastSeen: new Date(),
  },
];

export const createInitialChats = (currentUser: User, demoUsers: User[]): Chat[] => {
  return demoUsers.map((demoUser, index) => ({
    id: `chat-${index + 1}`,
    participants: [currentUser, demoUser],
    unreadCount: index === 0 ? 2 : 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)),
    updatedAt: new Date(Date.now() - 1000 * 60 * (index * 15)),
  }));
};

export const createInitialMessages = (chats: Chat[], currentUserId: string): Message[] => {
  const messages: Message[] = [];
  
  // Chat 1 - Sarah Chen
  const chat1 = chats[0];
  if (chat1) {
    const otherUser = chat1.participants.find(p => p.id !== currentUserId);
    if (otherUser) {
      messages.push(
        {
          id: 'msg-1',
          chatId: chat1.id,
          senderId: otherUser.id,
          content: 'Hey! How are you doing?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          status: 'read',
        },
        {
          id: 'msg-2',
          chatId: chat1.id,
          senderId: currentUserId,
          content: "I'm doing great, thanks! Just working on this new project.",
          timestamp: new Date(Date.now() - 1000 * 60 * 55),
          status: 'read',
        },
        {
          id: 'msg-3',
          chatId: chat1.id,
          senderId: otherUser.id,
          content: "That sounds exciting! What's it about?",
          timestamp: new Date(Date.now() - 1000 * 60 * 50),
          status: 'read',
        },
        {
          id: 'msg-4',
          chatId: chat1.id,
          senderId: currentUserId,
          content: "It's a real-time chat application. Pretty cool stuff!",
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          status: 'read',
        },
        {
          id: 'msg-5',
          chatId: chat1.id,
          senderId: otherUser.id,
          content: "Oh nice! Let me know if you need any help testing it 😊",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          status: 'delivered',
        }
      );
    }
  }

  // Chat 2 - Alex Rivera
  const chat2 = chats[1];
  if (chat2) {
    const otherUser = chat2.participants.find(p => p.id !== currentUserId);
    if (otherUser) {
      messages.push(
        {
          id: 'msg-6',
          chatId: chat2.id,
          senderId: currentUserId,
          content: 'Did you see the game last night?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          status: 'read',
        },
        {
          id: 'msg-7',
          chatId: chat2.id,
          senderId: otherUser.id,
          content: 'Yes! It was incredible. That last minute goal!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          status: 'read',
        }
      );
    }
  }

  // Chat 3 - Jordan Park
  const chat3 = chats[2];
  if (chat3) {
    const otherUser = chat3.participants.find(p => p.id !== currentUserId);
    if (otherUser) {
      messages.push(
        {
          id: 'msg-8',
          chatId: chat3.id,
          senderId: otherUser.id,
          content: "Welcome to the app! Feel free to send a message.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          status: 'read',
        }
      );
    }
  }

  return messages;
};

export const generateAutoReply = (chatId: string, senderId: string): Message => {
  const replies = [
    "That's interesting! Tell me more.",
    "I see what you mean!",
    "Haha, that's funny 😄",
    "Great point!",
    "I was just thinking the same thing.",
    "Thanks for sharing that!",
    "Oh really? That's cool!",
    "Nice! Keep me posted.",
  ];
  
  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  
  return {
    id: `msg-${Date.now()}`,
    chatId,
    senderId,
    content: randomReply,
    timestamp: new Date(),
    status: 'delivered',
  };
};
