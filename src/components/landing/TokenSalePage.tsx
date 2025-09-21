import React, { useState, useEffect } from 'react';
import { 
  Shield, LineChart, Zap, Bot, Wallet, ArrowRight, Twitter, Github, 
  Disc as Discord, Mail, ChevronRight, Globe, Lock, Coins, Clock,
  CreditCard, PieChart, Target, Users, CheckCircle2, Search, AlertCircle, 
  GitBranch, Calendar, Rocket, X, FileText, BarChart as ChartBar 
} from 'lucide-react';
import { SignupModal } from '../SignupModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0c] border border-white/10 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const TokenSalePage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLitePaperModal, setShowLitePaperModal] = useState(false);
  const [showTokenomicsModal, setShowTokenomicsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'usdt' | 'usdc' | 'eth' | 'bnb'>('usdt');
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSignupModal(true);
  };

  const renderTokenBoxButtons = () => (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button
        onClick={() => setShowLitePaperModal(true)}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
      >
        <FileText className="w-5 h-5" />
        <span>Lite Paper</span>
      </button>
      <button
        onClick={() => setShowTokenomicsModal(true)}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
      >
        <ChartBar className="w-5 h-5" />
        <span>Tokenomics</span>
      </button>
    </div>
  );

  const renderModals = () => (
    <>
      <Modal
        isOpen={showLitePaperModal}
        onClose={() => setShowLitePaperModal(false)}
        title="Lite Paper"
      >
        <div className="prose prose-invert max-w-none">
          <h3>Introduction</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <h3>Vision & Mission</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <h3>Technology</h3>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>

          <h3>Market Analysis</h3>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>

          <h3>Token Utility</h3>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
          </p>

          <h3>Roadmap</h3>
          <p>
            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
          </p>

          <h3>Team</h3>
          <p>
            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showTokenomicsModal}
        onClose={() => setShowTokenomicsModal(false)}
        title="Detailed Tokenomics"
      >
        <div className="space-y-8">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Token Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-sm text-white/60">Total Supply</div>
                <div className="text-2xl font-bold">1,000,000,000</div>
                <div className="text-sm text-white/60">DFN Tokens</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-sm text-white/60">Initial Market Cap</div>
                <div className="text-2xl font-bold">$18,000,000</div>
                <div className="text-sm text-white/60">Fully Diluted</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Token Distribution</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Public Sale', percentage: 30, amount: '300,000,000 DFN' },
                { name: 'Team', percentage: 20, amount: '200,000,000 DFN' },
                { name: 'Treasury', percentage: 25, amount: '250,000,000 DFN' },
                { name: 'Liquidity', percentage: 15, amount: '150,000,000 DFN' },
                { name: 'Advisors', percentage: 10, amount: '100,000,000 DFN' }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-blue-400">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-white/60">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Vesting Schedule</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="space-y-4">
              {[
                {
                  category: 'Public Sale Tokens',
                  schedule: '25% unlocked at TGE, 75% linear vesting over 6 months'
                },
                {
                  category: 'Team Tokens',
                  schedule: '6-month cliff, then linear vesting over 18 months'
                },
                {
                  category: 'Treasury',
                  schedule: '10% unlocked at TGE, then linear vesting over 24 months'
                },
                {
                  category: 'Liquidity',
                  schedule: '100% unlocked at TGE for initial liquidity provision'
                },
                {
                  category: 'Advisor Tokens',
                  schedule: '3-month cliff, then linear vesting over 12 months'
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="font-medium mb-1">{item.category}</div>
                  <div className="text-sm text-white/60">{item.schedule}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://kaaom.com/kaaom-white-removebg-preview.png?url=%2Fkaaom-white-removebg-preview.png&w=128&q=75"
                alt="Kaaom"
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#tokenomics" className="text-white/80 hover:text-white transition-colors">Tokenomics</a>
              <a href="#roadmap" className="text-white/80 hover:text-white transition-colors">Roadmap</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-white/80 hover:text-white transition-colors">
                Sign In
              </button>
              <button 
                onClick={() => setShowSignupModal(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                KAAOM Token Sale
              </h1>
              <p className="text-xl text-white/60 mb-8">
                Join the future of decentralized finance with Kaaom. Early investors get exclusive benefits and governance rights.
              </p>

              {/* Timer */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm text-white/60">Days</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm text-white/60">Hours</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm text-white/60">Minutes</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm text-white/60">Seconds</div>
                  </div>
                </div>
              </div>

              {/* Purchase Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Amount (USD)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {[100, 500, 1000, 5000].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(value.toString())}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        ${value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'usdt', name: 'USDT', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
                      { id: 'usdc', name: 'USDC', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
                      { id: 'eth', name: 'ETH', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
                      { id: 'bnb', name: 'BNB', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl ${
                          selectedPaymentMethod === method.id
                            ? 'bg-blue-500'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <img
                          src={method.logo}
                          alt={method.name}
                          className="w-8 h-8 mx-auto mb-2"
                        />
                        <div className="text-xs font-medium">{method.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 transition-colors rounded-xl font-medium"
                >
                  Buy Tokens
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-white/60">Token Price</div>
                    <div className="text-3xl font-bold">$0.018</div>
                    <div className="text-sm text-green-400">+5% Next Round</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-white/60">Raised Amount</div>
                    <div className="text-3xl font-bold">$4,850,000</div>
                    <div className="text-sm text-white/60">of $6,000,000 Goal</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Progress</span>
                      <span>80.83%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: '80.83%' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60 mb-1">Min Purchase</div>
                      <div className="font-bold">$100</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60 mb-1">Max Purchase</div>
                      <div className="font-bold">$500,000</div>
                    </div>
                  </div>

                  {renderTokenBoxButtons()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tokenomics</h2>
            <p className="text-xl text-white/60">
              Strategic token distribution for sustainable growth
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Token Distribution */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-3xl" />
              <div className="relative bg-white/5 rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-8">Token Distribution</h3>
                <div className="space-y-6">
                  {[
                    { category: 'Public Sale', percentage: 30, description: 'Available for public token sale', color: 'from-blue-500 to-blue-400' },
                    { category: 'Team', percentage: 20, description: '2-year vesting with 6-month cliff', color: 'from-purple-500 to-purple-400' },
                    { category: 'Treasury', percentage: 25, description: 'Protocol development and maintenance', color: 'from-green-500 to-green-400' },
                    { category: 'Liquidity', percentage: 15, description: 'Initial DEX liquidity', color: 'from-yellow-500 to-yellow-400' },
                    { category: 'Advisors', percentage: 10, description: '18-month vesting with 3-month cliff', color: 'from-pink-500 to-pink-400' }
                  ].map((item, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 text-right font-bold text-lg">{item.percentage}%</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{item.category}</span>
                            <span className="text-sm text-white/60">{item.percentage}M Tokens</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500 group-hover:opacity-80`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <p className="text-sm text-white/60 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Token Details & Vesting */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl blur-3xl" />
                <div className="relative bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Token Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-white/60 mb-1">Token Name</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                          KAAOM
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Token Symbol</div>
                        <div className="text-xl font-bold">KOM</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Blockchain</div>
                        <div className="text-xl font-bold">Ethereum</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-white/60 mb-1">Total Supply</div>
                        <div className="text-xl font-bold">1,000,000,000</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Initial Price</div>
                        <div className="text-xl font-bold">$0.018</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/60 mb-1">Market Cap</div>
                        <div className="text-xl font-bold">$18M FDV</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-3xl" />
                <div className="relative bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Vesting Schedule</h3>
                  <div className="space-y-4">
                    {[
                      {
                        category: 'Public Sale',
                        schedule: '25% unlocked at TGE, 75% linear vesting over 6 months',
                        color: 'border-blue-500'
                      },
                      {
                        category: 'Team & Advisors',
                        schedule: '6-month cliff, then linear vesting over 18 months',
                        color: 'border-purple-500'
                      },
                      {
                        category: 'Treasury',
                        schedule: '10% unlocked at TGE, then linear vesting over 24 months',
                        color: 'border-green-500'
                      }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 bg-white/5 rounded-lg border-l-4 ${item.color} hover:bg-white/10 transition-colors`}
                      >
                        <div className="font-medium mb-1">{item.category}</div>
                        <div className="text-sm text-white/60">{item.schedule}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://kaaom.com/kaaom-white-removebg-preview.png?url=%2Fkaaom-white-removebg-preview.png&w=128&q=75"
                  alt="Kaaom"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-white/60 mb-4">
                Building the future of decentralized finance.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Discord className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Whitepaper</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">GitHub</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Disclaimer</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <p className="text-white/60 mb-4">
                Stay updated with our latest announcements.
              </p>
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-white/20"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <div className="text-white/60 mb-4 md:mb-0">
              © 2024 Kaaom. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {renderModals()}
    </div>
  );
};

export { TokenSalePage };