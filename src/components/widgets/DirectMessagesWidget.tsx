import React, { useState } from 'react';
import { MessageSquare, Send, Plus } from 'lucide-react';

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: string;
  isMe?: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'Bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      isOnline: true
    },
    content: "Hey! Just wanted to share my latest trade analysis. Looking at some interesting setups in the DeFi sector. 📊",
    timestamp: '11:15 AM'
  },
  {
    id: '2',
    sender: {
      name: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      isOnline: true
    },
    content: "Thanks for sharing! What specific protocols are you looking at?",
    timestamp: '11:16 AM',
    isMe: true
  },
  {
    id: '3',
    sender: {
      name: 'Bob',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      isOnline: true
    },
    content: "Mainly focusing on Aave and Compound. The lending rates are looking attractive right now.",
    timestamp: '11:17 AM'
  }
];

export const DirectMessagesWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: 'You',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        isOnline: true
      },
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="p-2 h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto ai-chat-scrollbar space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${message.isMe ? 'flex-row-reverse' : ''}`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={message.sender.avatar}
                alt={message.sender.name}
                className="w-6 h-6 rounded-full"
              />
              {message.sender.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0c]" />
              )}
            </div>
            <div className={`max-w-[75%] ${message.isMe ? 'items-end' : 'items-start'}`}>
              <div className={`p-2 rounded-lg text-sm ${
                message.isMe ? 'bg-blue-500/20' : 'bg-white/5'
              }`}>
                {message.content}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-2 flex items-center gap-2">
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`p-1.5 rounded-lg transition-colors ${
            newMessage.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};