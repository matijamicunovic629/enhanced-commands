import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Search, Filter, 
  MessageSquare, Share2, Heart, Play, Pause,
  Video, BarChart2, RefreshCw, Users, Bell,
  ChevronDown, ArrowRight, Plus, Lock, Globe,
  Settings, ExternalLink, TrendingUp, TrendingDown,
  DollarSign, LineChart, Shield, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { VideoCallModal } from './VideoCallModal';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatUser {
  id: string;
  name: string;
  ens: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  status?: string;
  nftAccess?: {
    collection: string;
    tokenId: string;
    image: string;
    verified: boolean;
  }[];
}

interface ChatGroup {
  id: string;
  name: string;
  description: string;
  members: ChatUser[];
  type: 'public' | 'private' | 'nft-gated';
  icon: string;
  requiredNft?: {
    collection: string;
    image: string;
  };
}

const mockUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Alice',
    ens: 'alice.eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    isOnline: true,
    status: 'Trading BTC/ETH pairs 📈',
    nftAccess: [
      {
        collection: 'Bored Ape Yacht Club',
        tokenId: '#8817',
        image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=256',
        verified: true
      }
    ]
  },
  {
    id: '2',
    name: 'Bob',
    ens: 'bob.eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    isOnline: true,
    status: 'DeFi degen 🌾',
    nftAccess: [
      {
        collection: 'Azuki',
        tokenId: '#4391',
        image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256',
        verified: true
      }
    ]
  },
  {
    id: '3',
    name: 'Charlie',
    ens: 'charlie.eth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    isOnline: false,
    lastSeen: '2 hours ago',
    nftAccess: [
      {
        collection: 'Pudgy Penguins',
        tokenId: '#2156',
        image: 'https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?auto=format&dpr=1&w=256',
        verified: true
      }
    ]
  }
];

const mockGroups: ChatGroup[] = [
  {
    id: 'wow',
    name: 'Wealth of Wisdom',
    description: 'Exclusive community for financial wisdom and insights',
    members: mockUsers.slice(0, 8),
    type: 'public',
    icon: 'https://wealthofwisdom.io/wp-content/uploads/2022/12/wow-logoi1.svg'
  },
  {
    id: 'trading',
    name: 'Trading Group',
    description: 'Discuss trading strategies and market analysis',
    members: mockUsers.slice(0, 5),
    type: 'public',
    icon: '📈'
  },
  {
    id: 'defi',
    name: 'DeFi Discussion',
    description: 'All things DeFi - yields, protocols, and strategies',
    members: mockUsers.slice(1, 6),
    type: 'public',
    icon: '🌾'
  },
  {
    id: 'bayc-alpha',
    name: 'BAYC Alpha',
    description: 'Exclusive BAYC holders chat',
    members: mockUsers.filter(user => 
      user.nftAccess?.some(nft => nft.collection === 'Bored Ape Yacht Club')
    ),
    type: 'nft-gated',
    icon: '🐵',
    requiredNft: {
      collection: 'Bored Ape Yacht Club',
      image: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256'
    }
  },
  {
    id: 'azuki-dao',
    name: 'Azuki DAO',
    description: 'Azuki holders governance chat',
    members: mockUsers.filter(user => 
      user.nftAccess?.some(nft => nft.collection === 'Azuki')
    ),
    type: 'nft-gated',
    icon: '⛩️',
    requiredNft: {
      collection: 'Azuki',
      image: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&dpr=1&w=256'
    }
  }
];

const tradingGroupMessages = [
  {
    id: '1',
    sender: {
      id: '4',
      name: 'CryptoWhale',
      ens: 'whale.eth',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=whale',
      isOnline: true,
      status: 'Trading 24/7 🐋'
    },
    content: "BTC looking bullish on the 4h chart. Clear breakout above resistance. 📈",
    timestamp: '10:30 AM',
    reactions: [
      { emoji: '🚀', count: 5, reacted: true },
      { emoji: '👀', count: 3, reacted: false }
    ]
  }
];

const bobDirectMessages = [
  {
    id: '1',
    sender: mockUsers[1], // Bob
    content: "Hey! Just wanted to share my latest trade analysis. Looking at some interesting setups in the DeFi sector. 📊",
    timestamp: '11:15 AM'
  }
];

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMode, setChatMode] = useState<'group' | 'p2p'>('group');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'public' as const
  });
  const [messages, setMessages] = useState<Record<string, any[]>>({
    'bob': bobDirectMessages
  });
  const [currentUserNfts] = useState([
    {
      collection: 'Bored Ape Yacht Club',
      tokenId: '#1234',
      image: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&dpr=1&w=256',
      verified: true
    }
  ]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: {
        id: 'me',
        name: 'You',
        ens: 'you.eth',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        isOnline: true,
        status: 'Online'
      },
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    if (selectedUser?.id === '2') { // Bob's chat
      setMessages(prev => ({
        ...prev,
        'bob': [...(prev['bob'] || []), newMessage]
      }));
    }

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canAccessChat = (user: ChatUser | null, group: ChatGroup | null) => {
    if (!user && !group) return true;
    if (group?.type === 'public') return true;
    if (group?.type === 'nft-gated') {
      return currentUserNfts.some(nft => 
        nft.collection === group.requiredNft?.collection
      );
    }
    if (user?.nftAccess) {
      return currentUserNfts.some(userNft => 
        user.nftAccess?.some(requiredNft => 
          requiredNft.collection === userNft.collection
        )
      );
    }
    return true;
  };

  const renderAccessBadge = (user: ChatUser | null, group: ChatGroup | null) => {
    if (!user && !group) return null;
    
    const hasAccess = canAccessChat(user, group);
    const requiredNft = group?.type === 'nft-gated' ? group.requiredNft : 
                       user?.nftAccess?.[0];

    if (!requiredNft) return null;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        hasAccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {hasAccess ? (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Access Granted</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-4 h-4" />
            <span>Requires {requiredNft.collection}</span>
          </>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    if (!selectedGroup && !selectedUser) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/40">
          <MessageSquare className="w-12 h-12 mb-4" />
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      );
    }

    // Check access before showing messages
    if (!canAccessChat(selectedUser, selectedGroup)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <Shield className="w-16 h-16 text-red-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">NFT Required</h3>
          <p className="text-white/60 mb-4">
            This {selectedGroup ? 'group' : 'chat'} requires ownership of{' '}
            {selectedGroup?.requiredNft?.collection || selectedUser?.nftAccess?.[0].collection}
          </p>
          <div className="flex items-center gap-4">
            <img 
              src={selectedGroup?.requiredNft?.image || selectedUser?.nftAccess?.[0].image}
              alt="Required NFT"
              className="w-24 h-24 rounded-lg"
            />
            <div className="text-left">
              <h4 className="font-medium mb-2">Required NFT</h4>
              <p className="text-sm text-white/60">
                You need to own at least one NFT from this collection to access the chat
              </p>
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
              >
                <span>Buy on OpenSea</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Show trading group messages
    if (selectedGroup?.id === 'trading') {
      return (
        <div className="space-y-4">
          {tradingGroupMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <img
                src={msg.sender.avatar}
                alt={msg.sender.name}
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{msg.sender.name}</span>
                  <span className="text-sm text-white/60">{msg.sender.ens}</span>
                  <span className="text-sm text-white/40">{msg.timestamp}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  {msg.content}
                </div>
                {msg.reactions && (
                  <div className="flex items-center gap-2 mt-2">
                    {msg.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                          reaction.reacted ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10'
                        } transition-colors`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                    <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Show Bob's direct messages
    if (selectedUser?.id === '2') { // Bob's ID
      const chatMessages = messages['bob'] || [];
      return (
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <img
                src={msg.sender.avatar}
                alt={msg.sender.name}
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{msg.sender.name}</span>
                  <span className="text-sm text-white/60">{msg.sender.ens}</span>
                  <span className="text-sm text-white/40">{msg.timestamp}</span>
                </div>
                <div className={`rounded-lg p-3 ${
                  msg.sender.id === 'me' ? 'bg-blue-500/20 ml-auto' : 'bg-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Empty state for other chats
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <MessageSquare className="w-12 h-12 mb-4" />
        <p>No messages yet</p>
        <p className="text-sm">Start a conversation!</p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div
          className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out flex ${
            isFullscreen
              ? 'w-full h-full rounded-none'
              : 'w-[90%] h-[90%] rounded-xl'
          }`}
        >
          {/* Left Sidebar */}
          <div className="w-80 border-r border-white/10">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setChatMode('group')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    chatMode === 'group' ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Groups</span>
                </button>
                <button
                  onClick={() => setChatMode('p2p')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    chatMode === 'p2p' ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Direct</span>
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${chatMode === 'group' ? 'groups' : 'users'}...`}
                  className="w-full bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
                />
              </div>

              {chatMode === 'group' && (
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Group</span>
                </button>
              )}
            </div>

            <div className="p-2 space-y-1">
              {chatMode === 'group' ? (
                mockGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedUser(null);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedGroup?.id === group.id
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {group.id === 'wow' ? (
                      <img src={group.icon} alt="WOW" className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {group.icon}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.name}</span>
                        {group.type === 'private' && (
                          <Lock className="w-3 h-3 text-white/40" />
                        )}
                        {group.type === 'nft-gated' && (
                          <Shield className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                      <div className="text-sm text-white/60 truncate">
                        {group.members.length} members
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                mockUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedGroup(null);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0c] ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {user.nftAccess && (
                          <Shield className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {user.isOnline ? user.status || user.ens : user.lastSeen}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {selectedUser ? (
                  <>
                    <div className="relative">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0c] ${
                        selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{selectedUser.name}</div>
                      <div className="text-sm text-white/60">
                        {selectedUser.isOnline ? selectedUser.status || selectedUser.ens : selectedUser.lastSeen}
                      </div>
                    </div>
                  </>
                ) : selectedGroup ? (
                  <>
                    {selectedGroup.id === 'wow' ? (
                      <img src={selectedGroup.icon} alt="WOW" className="w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {selectedGroup.icon}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedGroup.name}</span>
                        {selectedGroup.type === 'private' && (
                          <Lock className="w-3 h-3 text-white/40" />
                        )}
                        {selectedGroup.type === 'nft-gated' && (
                          <Shield className="w-3 h-3 text-white/40" />
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {selectedGroup.members.length} members
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-white/40">Select a chat to start messaging</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {renderAccessBadge(selectedUser, selectedGroup)}
                {selectedUser?.isOnline && (
                  <>
                    <button 
                      onClick={() => setIsVideoCallActive(true)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )}
                {selectedGroup && (
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto ai-chat-scrollbar">
              {renderMessages()}
            </div>

            {/* Chat Input */}
            {canAccessChat(selectedUser, selectedGroup) && (
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 px-4 py-2 rounded-lg outline-none"
                  />
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      message.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/10 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoCallModal
        isOpen={isVideoCallActive}
        onClose={() => setIsVideoCallActive(false)}
        user={selectedUser}
      />
    </>
  );
};