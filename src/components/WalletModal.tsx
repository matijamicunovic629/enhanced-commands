import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, ArrowDown, CreditCard, Send, Wallet, TrendingUp, LayoutGrid, History, Landmark, ExternalLink, Clock, Coins, Gift, Check } from 'lucide-react';
import { SendDrawer } from './wallet/SendDrawer';
import { ReceiveDrawer } from './wallet/ReceiveDrawer';
import { BuyDrawer } from './wallet/BuyDrawer';
import { mockTransactions, mockDeFiPositions, mockDeFiStats, formatTransactionAmount, formatUsdValue, formatApy, getHealthFactorColor, getTransactionStatusColor } from '../lib/wallet';
import { TransactionType } from '../types/wallet';
import { useStore } from '../store/useStore';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'assets' | 'activity' | 'defi'>('assets');
  const [showSendDrawer, setShowSendDrawer] = useState(false);
  const [showReceiveDrawer, setShowReceiveDrawer] = useState(false);
  const [showBuyDrawer, setShowBuyDrawer] = useState(false);
  const [showTokenClaimed, setShowTokenClaimed] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const { gameStats } = useStore();

  // Check if tokens were recently claimed
  useEffect(() => {
    if (gameStats.lastClaimDate) {
      const lastClaimDate = new Date(gameStats.lastClaimDate);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastClaimDate.getTime()) / (1000 * 60));
      
      // Show notification if tokens were claimed in the last 5 minutes
      if (diffInMinutes < 5) {
        setClaimedAmount(gameStats.claimedTokens);
        setShowTokenClaimed(true);
        
        // Hide notification after 5 seconds
        const timer = setTimeout(() => {
          setShowTokenClaimed(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameStats.lastClaimDate, gameStats.claimedTokens, isOpen]);

  const renderAssets = () => (
    <div className="space-y-4">
      {/* Token Claimed Notification */}
      {showTokenClaimed && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Game Tokens Claimed!</div>
              <div className="text-sm text-white/60">
                {claimedAmount} tokens have been added to your wallet
              </div>
            </div>
            <button
              onClick={() => setShowTokenClaimed(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Total Balance */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="text-sm text-white/60">Total Balance</div>
        <div className="text-3xl font-bold mt-1">{formatUsdValue(mockDeFiStats.netWorth)}</div>
        <div className="flex items-center gap-1 mt-1 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span>+1.57% TODAY</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setShowSendDrawer(true)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>Send</span>
        </button>
        <button 
          onClick={() => setShowReceiveDrawer(true)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <ArrowDown className="w-5 h-5" />
          <span>Receive</span>
        </button>
        <button 
          onClick={() => setShowBuyDrawer(true)}
          className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          <span>Buy</span>
        </button>
      </div>

      {/* Game Tokens Section */}
      {gameStats.claimedTokens > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <div className="font-medium">Game Tokens</div>
              </div>
              <div className="text-2xl font-bold mt-1">{gameStats.claimedTokens}</div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-lg transition-colors text-sm font-medium">
              Use Tokens
            </button>
          </div>
        </div>
      )}

      {/* Assets List */}
      <div className="space-y-2">
        {mockDeFiPositions.map((position) => (
          <div
            key={position.id}
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={position.token.logo} alt={position.token.symbol} className="w-8 h-8" />
              <div>
                <div className="font-medium">{position.token.symbol}</div>
                <div className="text-sm text-white/60">
                  {formatTransactionAmount(position.amount, position.token.symbol)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div>{formatUsdValue(position.value)}</div>
              <div className="text-sm text-green-400">
                {formatApy(position.apy)} APY
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-3">
      {mockTransactions.map((tx) => (
        <div
          key={tx.id}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tx.type === TransactionType.RECEIVE ? 'bg-green-500/20 text-green-400' :
                tx.type === TransactionType.SEND ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {tx.type}
              </span>
              <span className="text-sm text-white/60">
                {tx.timestamp.toLocaleString()}
              </span>
            </div>
            <a
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-white/40" />
            </a>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tx.type === TransactionType.SWAP ? (
                <div className="flex items-center gap-1">
                  <img src={tx.fromToken?.logo} alt={tx.fromToken?.symbol} className="w-6 h-6" />
                  <ArrowDown className="w-4 h-4 text-white/40 rotate-[-90deg]" />
                  <img src={tx.toToken?.logo} alt={tx.toToken?.symbol} className="w-6 h-6" />
                </div>
              ) : (
                <img src={tx.token?.logo} alt={tx.token?.symbol} className="w-6 h-6" />
              )}
              <div>
                {tx.type === TransactionType.SWAP ? (
                  <div className="text-sm">
                    {formatTransactionAmount(tx.fromAmount || 0, tx.fromToken?.symbol || '')} →{' '}
                    {formatTransactionAmount(Math.abs(tx.toAmount || 0), tx.toToken?.symbol || '')}
                  </div>
                ) : (
                  <div className="text-sm">
                    {formatTransactionAmount(tx.amount, tx.token?.symbol || '')}
                  </div>
                )}
                {tx.value && (
                  <div className="text-sm text-white/60">
                    {formatUsdValue(tx.value)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={getTransactionStatusColor(tx.status)}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
              <div className="text-sm text-white/60">
                Fee: {formatUsdValue(tx.fee)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeFi = () => (
    <div className="space-y-6">
      {/* DeFi Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Total Value Locked</div>
          <div className="text-2xl font-bold mt-1">
            {formatUsdValue(mockDeFiStats.totalValueLocked)}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {mockDeFiStats.distribution.lending}% Lending
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Daily Yield</div>
          <div className="text-2xl font-bold mt-1">
            {formatUsdValue(mockDeFiStats.dailyYield)}
          </div>
          <div className="text-sm text-green-400 mt-1">
            {formatApy(mockDeFiStats.averageApy)} APY
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60">Risk Level</div>
          <div className="text-2xl font-bold mt-1">
            {mockDeFiStats.riskLevel}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {mockDeFiStats.distribution.borrowing}% Borrowed
          </div>
        </div>
      </div>

      {/* DeFi Positions */}
      <div className="space-y-3">
        {mockDeFiPositions.map((position) => (
          <div
            key={position.id}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={position.protocolLogo}
                  alt={position.protocol}
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-medium">{position.protocol}</div>
                  <div className="text-sm text-white/60">{position.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {formatUsdValue(position.value)}
                </div>
                <div className="text-sm text-green-400">
                  {formatApy(position.apy)} APY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/60">Amount:</span>{' '}
                {formatTransactionAmount(position.amount, position.token.symbol)}
              </div>
              {position.rewards && (
                <div>
                  <span className="text-white/60">Rewards:</span>{' '}
                  {formatUsdValue(position.rewards.value)}
                </div>
              )}
              {position.healthFactor && (
                <div>
                  <span className="text-white/60">Health:</span>{' '}
                  <span className={getHealthFactorColor(position.healthFactor)}>
                    {position.healthFactor.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto text-white/60">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor((Date.now() - position.startDate.getTime()) / (1000 * 60 * 60 * 24))}d
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-[400px] transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="glass border-l border-white/10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Wallet</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto ai-chat-scrollbar">
            {selectedTab === 'assets' && renderAssets()}
            {selectedTab === 'activity' && renderActivity()}
            {selectedTab === 'defi' && renderDeFi()}
          </div>

          {/* Bottom Tab Bar */}
          <div className="flex items-center justify-around p-2 border-t border-white/10">
            <button
              onClick={() => setSelectedTab('assets')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                selectedTab === 'assets' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="text-xs">Assets</span>
            </button>
            <button
              onClick={() => setSelectedTab('activity')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                selectedTab === 'activity' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="text-xs">Activity</span>
            </button>
            <button
              onClick={() => setSelectedTab('defi')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                selectedTab === 'defi' ? 'text-blue-400' : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Landmark className="w-5 h-5" />
              <span className="text-xs">DeFi</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Drawers */}
    <SendDrawer
      isOpen={showSendDrawer}
      onClose={() => setShowSendDrawer(false)}
      assets={mockDeFiPositions.map(p => ({
        id: p.id,
        name: p.token.symbol,
        symbol: p.token.symbol,
        amount: p.amount,
        logo: p.token.logo
      }))}
    />

    <ReceiveDrawer
      isOpen={showReceiveDrawer}
      onClose={() => setShowReceiveDrawer(false)}
      assets={mockDeFiPositions.map(p => ({
        id: p.id,
        name: p.token.symbol,
        symbol: p.token.symbol,
        logo: p.token.logo
      }))}
      walletAddress="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    />

    <BuyDrawer
      isOpen={showBuyDrawer}
      onClose={() => setShowBuyDrawer(false)}
      assets={mockDeFiPositions.map(p => ({
        id: p.id,
        name: p.token.symbol,
        symbol: p.token.symbol,
        logo: p.token.logo
      }))}
    />
    </>
  );
};