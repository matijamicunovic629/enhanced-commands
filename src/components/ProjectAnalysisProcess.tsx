import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle2, X, AlertTriangle, Shield, Users, Code, LineChart, Wallet, Layers, GitBranch } from 'lucide-react';

interface ProjectAnalysisProcessProps {
  onClose: () => void;
  projectName: string;
}

export const ProjectAnalysisProcess: React.FC<ProjectAnalysisProcessProps> = ({ onClose, projectName }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (step === 1) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setStep(2);
              setShowResults(true);
            }, 500);
            return 100;
          }
          return p + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [step]);

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0">
          <svg className="w-full h-full">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${progress * 3.77} 377`}
              className="transform -rotate-90 transition-all duration-300"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="w-12 h-12 text-blue-500" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-medium">Analyzing Project</h3>
      <p className="mt-2 text-white/60 text-center max-w-md">
        Evaluating {projectName}'s technology, team, market fit, and tokenomics...
      </p>
    </div>
  );

  const renderResults = () => {
    const categories = [
      {
        name: 'Technology',
        score: 8,
        icon: Code,
        color: 'text-blue-400',
        details: 'AI-driven research and execution tool, leveraging smart automation for DeFi strategies'
      },
      {
        name: 'Team',
        score: 9,
        icon: Users,
        color: 'text-green-400',
        details: 'Experienced Web3 developers and AI specialists with DeFi track record'
      },
      {
        name: 'Market Fit',
        score: 7,
        icon: LineChart,
        color: 'text-purple-400',
        details: 'Strong fit with growing AI-driven crypto tools market'
      },
      {
        name: 'Tokenomics',
        score: 6,
        icon: Wallet,
        color: 'text-orange-400',
        details: 'Token model still evolving, sustainability concerns'
      },
      {
        name: 'Community',
        score: 7,
        icon: Users,
        color: 'text-pink-400',
        details: 'Active community with strong social media presence'
      },
      {
        name: 'Security',
        score: 8,
        icon: Shield,
        color: 'text-emerald-400',
        details: 'Multiple audits completed, bug bounty program active'
      }
    ];

    const partnerships = [
      { name: 'Chainlink', role: 'Oracle Integration' },
      { name: 'Arbitrum', role: 'Layer 2 Deployment' },
      { name: 'Aave', role: 'DeFi Integration' }
    ];

    const competitors = [
      { 
        name: 'Kaaom',
        advantage: 'Full ecosystem (wallet, social, trading)',
        disadvantage: 'Less AI specialization'
      },
      {
        name: 'Yearn',
        advantage: 'Established vault strategies',
        disadvantage: 'Less personalization'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Project Overview */}
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{projectName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  Pre-Exchange
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">AI/DeFi</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">DYOR</span>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${category.color.replace('text', 'bg')}/20 flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-2xl font-bold">{category.score}/10</div>
                </div>
              </div>
              <p className="text-sm text-white/60">{category.details}</p>
            </div>
          ))}
        </div>

        {/* Partnerships */}
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Strategic Partnerships</h3>
          <div className="grid grid-cols-3 gap-4">
            {partnerships.map((partner) => (
              <div key={partner.name} className="p-3 bg-white/5 rounded-lg">
                <div className="font-medium">{partner.name}</div>
                <div className="text-sm text-white/60">{partner.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis */}
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Competitive Analysis</h3>
          <div className="space-y-4">
            {competitors.map((competitor) => (
              <div key={competitor.name} className="p-4 bg-white/5 rounded-lg">
                <div className="font-medium mb-2">{competitor.name}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">{competitor.advantage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400" />
                    <span className="text-white/80">{competitor.disadvantage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium">Development Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Working prototype</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Initial partnerships secured</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-yellow-400" />
              <span>Mainnet launch in progress</span>
            </div>
          </div>
        </div>

        {/* Final Assessment */}
        <div className="bg-blue-500/10 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-3">Final Assessment</h3>
          <p className="text-white/80 leading-relaxed">
            Wayfinder presents a strong AI-driven approach to DeFi execution, with an experienced team and innovative technology. The project shows promise in combining AI capabilities with DeFi automation, supported by strategic partnerships with established protocols. However, improvements in tokenomics and community growth are needed to compete with established players. Consider this a high-potential but higher-risk investment opportunity.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-blue-500' : 'bg-white/10'
                }`}>
                  {step > s ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>
                {s < 2 && (
                  <div className={`w-12 h-0.5 ${
                    step > s ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-[calc(100%-60px)] overflow-y-auto ai-chat-scrollbar">
        {step === 1 && renderStep1()}
        {showResults && renderResults()}
      </div>
    </div>
  );
};