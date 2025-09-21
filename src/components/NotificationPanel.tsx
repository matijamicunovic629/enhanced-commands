import React, { useState } from 'react';
import { 
  X, Filter, Clock, ExternalLink, Bell, 
  RefreshCw, ArrowRightLeft, Wallet, 
  Coins, Landmark, CheckCircle2, XCircle,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface Notification {
  id: string;
  type: 'swap' | 'deposit' | 'reward' | 'order' | 'loan';
  title: string;
  details: string;
  txHash: string;
  timestamp: Date;
  status: 'success' | 'failed';
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'swap',
    title: 'Swap Completed',
    details: 'Successfully swapped 1 ETH for 1,850.45 USDC',
    txHash: '0x742d...f44e',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success',
    isRead: false
  },
  {
    id: '2',
    type: 'order',
    title: 'Limit Order Filled',
    details: 'Buy order for 0.5 BTC at $67,245.80 has been filled',
    txHash: '0x8Ba7...FF29',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success',
    isRead: false
  },
  {
    id: '3',
    type: 'deposit',
    title: 'Deposit Confirmed',
    details: 'Successfully deposited 1000 USDC',
    txHash: '0x3B4...a5d0',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success',
    isRead: true
  },
  {
    id: '4',
    type: 'loan',
    title: 'Lending Position Opened',
    details: 'Successfully supplied 500 USDC to Aave',
    txHash: '0x6B17...1d0F',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'success',
    isRead: true
  },
  {
    id: '5',
    type: 'reward',
    title: 'Staking Rewards',
    details: 'Claimed 0.1 ETH staking rewards',
    txHash: '0xdAC1...1ec7',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'success',
    isRead: true
  }
];

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return <ArrowRightLeft className="w-5 h-5" />;
      case 'deposit': return <Wallet className="w-5 h-5" />;
      case 'reward': return <Coins className="w-5 h-5" />;
      case 'order': return <RefreshCw className="w-5 h-5" />;
      case 'loan': return <Landmark className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-500/20 text-blue-400';
      case 'deposit': return 'bg-green-500/20 text-green-400';
      case 'reward': return 'bg-yellow-500/20 text-yellow-400';
      case 'order': return 'bg-purple-500/20 text-purple-400';
      case 'loan': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-white/20 text-white';
    }
  };

  const filteredNotifications = notifications
    .filter(n => selectedType === 'all' || n.type === selectedType)
    .filter(n => selectedStatus === 'all' || n.status === selectedStatus)
    .sort((a, b) => {
      return sortBy === 'newest' 
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime();
    });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'swap', label: 'Swaps', icon: ArrowRightLeft },
    { value: 'deposit', label: 'Deposits', icon: Wallet },
    { value: 'reward', label: 'Rewards', icon: Coins },
    { value: 'order', label: 'Orders', icon: RefreshCw },
    { value: 'loan', label: 'Loans', icon: Landmark }
  ];

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success', icon: CheckCircle2 },
    { value: 'failed', label: 'Failed', icon: XCircle }
  ];

  if (!isOpen) return null;

  return (
    <div className={`absolute ${isTopbarBottom ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-[400px] glass border border-white/10 rounded-xl shadow-lg z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-4 mb-4">
          {/* Type Dropdown */}
          <div className="flex-1 relative">
            <label className="block text-sm text-white/60 mb-1">Type</label>
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedType === 'all' ? (
                  <Filter className="w-4 h-4" />
                ) : (
                  getTypeIcon(selectedType)
                )}
                <span>{notificationTypes.find(t => t.value === selectedType)?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showTypeDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 py-1 glass rounded-lg z-20 border border-white/10">
                  {notificationTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedType(type.value);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors ${
                        selectedType === type.value ? 'bg-white/10' : ''
                      }`}
                    >
                      {type.icon ? <type.icon className="w-4 h-4" /> : null}
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex-1 relative">
            <label className="block text-sm text-white/60 mb-1">Status</label>
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : selectedStatus === 'failed' ? (
                  <XCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                <span>{statusTypes.find(s => s.value === selectedStatus)?.label}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showStatusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 py-1 glass rounded-lg z-20 border border-white/10">
                  {statusTypes.map(status => (
                    <button
                      key={status.value}
                      onClick={() => {
                        setSelectedStatus(status.value);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors ${
                        selectedStatus === status.value ? 'bg-white/10' : ''
                      }`}
                    >
                      {status.icon && (
                        <status.icon className={`w-4 h-4 ${
                          status.value === 'success' ? 'text-green-400' :
                          status.value === 'failed' ? 'text-red-400' : ''
                        }`} />
                      )}
                      <span>{status.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">
              Showing {filteredNotifications.length} notifications
            </span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm border border-white/10 hover:bg-white/10 transition-colors cursor-pointer appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.6)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '16px'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto notification-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="w-8 h-8 text-white/40 mb-2" />
            <p className="text-white/60">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-white/60 whitespace-nowrap">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/60 mt-1">{notification.details}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/60">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <a
                        href={`https://etherscan.io/tx/${notification.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{notification.txHash}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {notification.status === 'success' ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Success</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Failed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};