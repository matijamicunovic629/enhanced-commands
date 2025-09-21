import React, { useState, useEffect } from 'react';
import { Shield, LineChart, Zap, Bot, Wallet, ArrowRight, Twitter, Github, Disc as Discord, Mail, ChevronRight, Globe, Lock, Coins, BarChart2, Laptop, File as Mobile, Gamepad2, MessageSquare, TrendingUp } from 'lucide-react';
import { SignupModal } from '../SignupModal';

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Kaaom</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
              <a href="/token-sale" className="text-white/80 hover:text-white transition-colors">Token Sale</a>
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
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Your Portal to DeFi Excellence
              </h1>
              <p className="text-xl text-white/60 mb-8">
                Trade, earn, and explore the future of finance with our all-in-one cryptocurrency platform powered by advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowSignupModal(true)}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-lg font-medium flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-lg font-medium">
                  View Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-blue-400">$2.5B+</div>
                  <div className="text-white/60">Trading Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">100K+</div>
                  <div className="text-white/60">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">50+</div>
                  <div className="text-white/60">Integrations</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                          alt="BTC"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">Bitcoin</div>
                          <div className="text-sm text-white/60">BTC</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">$67,245.80</div>
                        <div className="text-green-400">+2.5%</div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          alt="ETH"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">Ethereum</div>
                          <div className="text-sm text-white/60">ETH</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">$3,245.67</div>
                        <div className="text-red-400">-1.2%</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src="https://cryptologos.cc/logos/solana-sol-logo.png"
                          alt="SOL"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">Solana</div>
                          <div className="text-sm text-white/60">SOL</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">$110.25</div>
                        <div className="text-green-400">+5.2%</div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src="https://cryptologos.cc/logos/cardano-ada-logo.png"
                          alt="ADA"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">Cardano</div>
                          <div className="text-sm text-white/60">ADA</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">$0.65</div>
                        <div className="text-red-400">-0.9%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Trade</h2>
            <p className="text-xl text-white/60">
              A comprehensive suite of trading tools and features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trading Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Trading</h3>
              <p className="text-white/60">
                Professional-grade trading interface with real-time charts, order books, and advanced order types.
              </p>
            </div>

            {/* AI Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
              <p className="text-white/60">
                Get personalized trading insights and market analysis powered by advanced AI technology.
              </p>
            </div>

            {/* Security Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
              <p className="text-white/60">
                Your assets are protected by military-grade encryption and multi-signature technology.
              </p>
            </div>

            {/* DeFi Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">DeFi Integration</h3>
              <p className="text-white/60">
                Access yield farming, liquidity pools, and staking opportunities all in one place.
              </p>
            </div>

            {/* Speed Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-white/60">
                Execute trades instantly with our high-performance matching engine.
              </p>
            </div>

            {/* Portfolio Features */}
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Portfolio Tracking</h3>
              <p className="text-white/60">
                Monitor your entire crypto portfolio with real-time updates and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trade Anywhere, Anytime</h2>
            <p className="text-xl text-white/60">
              Access your portfolio across all devices with our powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Web Platform</h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Advanced trading interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Full feature access</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                  <span>Real-time market data</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Mobile className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile App</h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-500" />
                  <span>Trade on the go</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-500" />
                  <span>Push notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-500" />
                  <span>Biometric security</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
              <ul className="space-y-2 text-white/60">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-green-500" />
                  <span>Voice commands</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-green-500" />
                  <span>Market insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-green-500" />
                  <span>Trading suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">More Than Just Trading</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">GameFi Integration</h3>
                    <p className="text-white/60">
                      Earn while you play with our integrated gaming platform. Compete in trading competitions and earn rewards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Social Trading</h3>
                    <p className="text-white/60">
                      Connect with other traders, share insights, and copy successful trading strategies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                    <p className="text-white/60">
                      Get deep insights into market trends with our AI-powered analytics tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80"
                alt="Trading Platform"
                className="relative rounded-3xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-white/60 mb-8">
            Join thousands of traders who have already chosen Dexfin as their preferred trading platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowSignupModal(true)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-lg font-medium flex items-center justify-center gap-2 group"
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-lg font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">Kaaom</span>
              </div>
              <p className="text-white/60 mb-4">
                Your portal to DeFi excellence. Trade, earn, and explore the future of finance.
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
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Security</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Roadmap</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Feedback</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">About</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Careers</a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">Press</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <p className="text-white/60 mb-4">
                Stay updated with our latest features and releases.
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

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </div>
  );
};

export { LandingPage };