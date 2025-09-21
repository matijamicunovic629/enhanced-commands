import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Search, Filter, 
  Rocket, Globe, Twitter, MessageSquare, Users,
  Clock, DollarSign, ChevronRight, AlertTriangle,
  FileText, ChevronDown, ExternalLink, Info
} from 'lucide-react';

interface LaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: 'DeFi' | 'NFT' | 'GameFi' | 'Infrastructure' | 'AI';
  status: 'live' | 'upcoming' | 'ended';
  tokenSymbol: string;
  tokenPrice: number;
  totalSupply: number;
  fundingGoal: number;
  fundingProgress: number;
  minContribution: number;
  maxContribution: number;
  startDate: Date;
  endDate: Date;
  socials: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  team: {
    name: string;
    role: string;
    avatar: string;
    linkedin?: string;
  }[];
  roadmap: {
    phase: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }[];
  tokenomics: {
    category: string;
    percentage: number;
    description: string;
  }[];
  risks: string[];
}

// Mock project data
const mockProjects: Project[] = [
  {
    id: 'defi-aggregator',
    name: 'DeFi Aggregator Protocol',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=defi',
    description: 'Next-generation DeFi aggregator with AI-powered yield optimization',
    category: 'DeFi',
    status: 'live',
    tokenSymbol: 'DAP',
    tokenPrice: 0.05,
    totalSupply: 100_000_000,
    fundingGoal: 5_500_000,
    fundingProgress: 5_320_000,
    minContribution: 100,
    maxContribution: 10000,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-04-15'),
    socials: {
      website: 'https://example.com',
      twitter: 'https://twitter.com',
      telegram: 'https://t.me',
      discord: 'https://discord.gg'
    },
    team: [
      {
        name: 'John Smith',
        role: 'CEO & Founder',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Sarah Johnson',
        role: 'CTO',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Michael Chen',
        role: 'Lead Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        linkedin: 'https://linkedin.com'
      }
    ],
    roadmap: [
      {
        phase: 'Q1 2024',
        title: 'Platform Launch',
        description: 'Initial platform launch with core features',
        status: 'completed'
      },
      {
        phase: 'Q2 2024',
        title: 'AI Integration',
        description: 'Integration of AI-powered yield optimization',
        status: 'in-progress'
      },
      {
        phase: 'Q3 2024',
        title: 'Cross-chain Support',
        description: 'Expansion to multiple blockchain networks',
        status: 'upcoming'
      }
    ],
    tokenomics: [
      {
        category: 'Public Sale',
        percentage: 30,
        description: 'Tokens available for public sale'
      },
      {
        category: 'Team',
        percentage: 20,
        description: '2-year vesting with 6-month cliff'
      },
      {
        category: 'Treasury',
        percentage: 25,
        description: 'Protocol development and maintenance'
      },
      {
        category: 'Liquidity',
        percentage: 15,
        description: 'Initial DEX liquidity'
      },
      {
        category: 'Advisors',
        percentage: 10,
        description: '18-month vesting with 3-month cliff'
      }
    ],
    risks: [
      'Smart contract vulnerabilities despite thorough audits',
      'Market volatility and potential token price fluctuations',
      'Regulatory changes in different jurisdictions',
      'Competition from existing and new DeFi protocols'
    ]
  },
  // Add more mock projects here...
];

export const LaunchpadModal: React.FC<LaunchpadModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'team' | 'roadmap'>('overview');
  const [contributionAmount, setContributionAmount] = useState('');
  const [showContribute, setShowContribute] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'progress' | 'date' | 'amount'>('progress');

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleContribute = () => {
    // Handle contribution logic
    setShowContribute(false);
  };

  const formatTimeLeft = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} days, ${hours} hours`;
  };

  const renderProjectList = () => (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-64 bg-white/5 pl-10 pr-4 py-2 rounded-lg outline-none placeholder:text-white/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'all' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('DeFi')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'DeFi' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              DeFi
            </button>
            <button
              onClick={() => setSelectedCategory('NFT')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'NFT' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              NFT
            </button>
            <button
              onClick={() => setSelectedCategory('GameFi')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === 'GameFi' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              GameFi
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm"
          >
            <option value="progress">Progress</option>
            <option value="date">End Date</option>
            <option value="amount">Min Amount</option>
          </select>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={project.logo}
                alt={project.name}
                className="w-16 h-16 rounded-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {project.category}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-1">{project.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Progress</span>
                  <span>{((project.fundingProgress / project.fundingGoal) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(project.fundingProgress / project.fundingGoal) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/60">
                    ${project.fundingProgress.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-white/60">Token Price</div>
                  <div className="font-medium">${project.tokenPrice}</div>
                </div>
                <div>
                  <div className="text-white/60">Min. Buy</div>
                  <div className="font-medium">${project.minContribution}</div>
                </div>
                <div>
                  <div className="text-white/60">Ends in</div>
                  <div className="font-medium">{formatTimeLeft(project.endDate)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <div className="h-full flex">
        {/* Left Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Project Header */}
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <img
              src={selectedProject.logo}
              alt={selectedProject.name}
              className="w-20 h-20 rounded-xl"
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  {selectedProject.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  LIVE
                </span>
              </div>
              <p className="text-white/60">{selectedProject.description}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tokenomics')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'tokenomics'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tokenomics
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'team'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'roadmap'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Roadmap
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Project Links */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Project Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={selectedProject.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Website</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                    <a
                      href={selectedProject.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                    <a
                      href={selectedProject.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Telegram</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                    <a
                      href={selectedProject.socials.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Users className="w-5 h-5" />
                      <span>Discord</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-medium">Risk Factors</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedProject.risks.map((risk, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-white/80"
                      >
                        <span className="text-white/40">•</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tokenomics' && (
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-6">Token Distribution</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {selectedProject.tokenomics.map((item, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-blue-400">{item.percentage}%</span>
                        </div>
                        <p className="text-sm text-white/60">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    {/* Pie Chart would go here */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">100M</div>
                        <div className="text-sm text-white/60">Total Supply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-6">Core Team</h3>
                <div className="grid grid-cols-3 gap-6">
                  {selectedProject.team.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg text-center"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4"
                      />
                      <h4 className="font-medium mb-1">{member.name}</h4>
                      <p className="text-white/60 text-sm mb-3">{member.role}</p>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-6">Project Roadmap</h3>
                <div className="space-y-6">
                  {selectedProject.roadmap.map((phase, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-6"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-green-500' :
                          phase.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-white/10'
                        }`}>
                          {index + 1}
                        </div>
                        {index < selectedProject.roadmap.length - 1 && (
                          <div className="w-px h-24 bg-white/10" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white/40">{phase.phase}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-white/10 text-white/60'
                          }`}>
                            {phase.status.replace('-', ' ')}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{phase.title}</h4>
                        <p className="text-white/60">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[400px] border-l border-white/10 p-6">
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">Progress</span>
                <span>{((selectedProject.fundingProgress / selectedProject.fundingGoal) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(selectedProject.fundingProgress / selectedProject.fundingGoal) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">
                  ${selectedProject.fundingProgress.toLocaleString()}
                </span>
                <span className="text-white/60">
                  ${selectedProject.fundingGoal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sale Info */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/60">Token Price</span>
                <span className="font-medium">${selectedProject.tokenPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total Supply</span>
                <span className="font-medium">
                  {selectedProject.totalSupply.toLocaleString()} {selectedProject.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Min. Contribution</span>
                <span className="font-medium">${selectedProject.minContribution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Max. Contribution</span>
                <span className="font-medium">${selectedProject.maxContribution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Sale Ends</span>
                <span className="font-medium">{formatTimeLeft(selectedProject.endDate)}</span>
              </div>
            </div>

            {/* Contribute Button */}
            <button
              onClick={() => setShowContribute(true)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
            >
              Contribute Now
            </button>

            {/* Important Notice */}
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Important Notice</span>
              </div>
              <p className="text-sm text-white/80">
                Please review the project details and risks before contributing. Tokens will be distributed after the sale ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContributeModal = () => {
    if (!selectedProject || !showContribute) return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContribute(false)} />
        <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">Contribute to {selectedProject.name}</h3>
            <button
              onClick={() => setShowContribute(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Amount (USDC)</label>
              <div className="relative">
                <input
                  type="text"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  Min: ${selectedProject.minContribution} / Max: ${selectedProject.maxContribution}
                </div>
              </div>
            </div>

            {/* Token Preview */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-white/60">You will receive</div>
                  <div className="text-2xl font-bold">
                    {contributionAmount
                      ? (parseFloat(contributionAmount) / selectedProject.tokenPrice).toFixed(2)
                      : '0'} {selectedProject.tokenSymbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Rate</div>
                  <div className="font-medium">
                    1 {selectedProject.tokenSymbol} = ${selectedProject.tokenPrice}
                  </div>
                </div>
              </div>
              <div className="text-sm text-white/60">
                Network Fee: ~$2.50
              </div>
            </div>

            {/* Terms */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-white/60" />
                <span className="text-sm">By contributing you agree to:</span>
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/60 rounded-full" />
                  <span>Project's terms and conditions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/60 rounded-full" />
                  <span>Token distribution schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/60 rounded-full" />
                  <span>Vesting period if applicable</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleContribute}
              disabled={!contributionAmount}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disable d:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              Confirm Contribution
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Rocket className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Launchpad</h2>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
          {selectedProject ? renderProjectDetails() : renderProjectList()}
        </div>

        {/* Contribute Modal */}
        {renderContributeModal()}
      </div>
    </div>
  );
};