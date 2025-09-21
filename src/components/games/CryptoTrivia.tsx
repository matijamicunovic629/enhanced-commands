import React, { useState, useEffect } from 'react';
import { X, Trophy, Timer, ArrowLeft, Brain, Check, X as XIcon } from 'lucide-react';

interface GameState {
  screen: 'menu' | 'difficulty' | 'game' | 'results';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: boolean[];
  highScore: number;
  bestStreak: number;
  totalTokens: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
}

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
}

// Enhanced question bank with more variety and educational content
const questions: Question[] = [
  {
    question: "What is Bitcoin's maximum supply?",
    answers: ["21 Million", "18 Million", "100 Million", "Unlimited"],
    correctAnswer: 0,
    explanation: "Bitcoin has a fixed maximum supply of 21 million coins, which helps maintain its scarcity and value."
  },
  {
    question: "What consensus mechanism does Ethereum 2.0 use?",
    answers: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of History"],
    correctAnswer: 1,
    explanation: "Ethereum 2.0 transitioned to Proof of Stake to improve scalability and energy efficiency."
  },
  {
    question: "What is a smart contract?",
    answers: [
      "A legal document",
      "Self-executing code on blockchain",
      "A trading agreement",
      "A wallet type"
    ],
    correctAnswer: 1,
    explanation: "Smart contracts are self-executing contracts with the terms directly written into code."
  },
  {
    question: "What is DeFi?",
    answers: [
      "Decentralized Finance",
      "Digital Finance",
      "Direct Finance",
      "Distributed Finance"
    ],
    correctAnswer: 0,
    explanation: "DeFi refers to financial services built on blockchain technology without traditional intermediaries."
  },
  {
    question: "What is a blockchain fork?",
    answers: [
      "A cryptocurrency split",
      "A mining tool",
      "A wallet backup",
      "A trading strategy"
    ],
    correctAnswer: 0,
    explanation: "A fork occurs when a blockchain diverges into two paths, creating two separate versions."
  },
  {
    question: "What is a private key used for?",
    answers: [
      "Website login",
      "Mining cryptocurrency",
      "Accessing your wallet",
      "Creating tokens"
    ],
    correctAnswer: 2,
    explanation: "Private keys are used to access and control funds in a cryptocurrency wallet."
  },
  {
    question: "What is a DEX?",
    answers: [
      "Digital Exchange",
      "Decentralized Exchange",
      "Direct Exchange",
      "Distributed Exchange"
    ],
    correctAnswer: 1,
    explanation: "A DEX is a decentralized exchange that operates without a central authority."
  },
  {
    question: "What is 'gas' in Ethereum?",
    answers: [
      "Network fuel",
      "A token type",
      "Mining reward",
      "Exchange fee"
    ],
    correctAnswer: 0,
    explanation: "Gas is the fee required to perform transactions on the Ethereum network."
  },
  {
    question: "What is a Layer 2 solution?",
    answers: [
      "A new blockchain",
      "A scaling solution",
      "A wallet type",
      "A mining protocol"
    ],
    correctAnswer: 1,
    explanation: "Layer 2 solutions are built on top of existing blockchains to improve scalability."
  },
  {
    question: "What is staking?",
    answers: [
      "Trading strategy",
      "Mining method",
      "Holding tokens to validate",
      "Token burning"
    ],
    correctAnswer: 2,
    explanation: "Staking involves locking up tokens to participate in network validation and earn rewards."
  }
];

export const CryptoTrivia: React.FC = () => {
  const [state, setState] = useState<GameState>({
    screen: 'menu',
    difficulty: 'Medium',
    currentQuestion: 0,
    score: 0,
    timeLeft: 0,
    answers: [],
    highScore: 0,
    bestStreak: 0,
    totalTokens: 0,
    selectedAnswer: null,
    showFeedback: false
  });

  useEffect(() => {
    if (state.screen === 'game') {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.screen]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.screen === 'game') {
      endGame();
    }
  }, [state.timeLeft]);

  const startGame = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const timeLimit = {
      'Easy': 60,
      'Medium': 45,
      'Hard': 30
    }[difficulty];

    setState(prev => ({
      ...prev,
      screen: 'game',
      difficulty,
      currentQuestion: 0,
      score: 0,
      timeLeft: timeLimit,
      answers: []
    }));
  };

  const handleAnswer = (answerIndex: number) => {
    if (state.showFeedback) return;

    const isCorrect = answerIndex === questions[state.currentQuestion].correctAnswer;
    const newAnswers = [...state.answers, isCorrect];

    setState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true
    }));

    setTimeout(() => {
      if (state.currentQuestion === questions.length - 1) {
        setState(prev => ({
          ...prev,
          answers: newAnswers,
          score: newAnswers.filter(a => a).length,
          screen: 'results',
          highScore: Math.max(prev.highScore, newAnswers.filter(a => a).length),
          totalTokens: prev.totalTokens + (newAnswers.filter(a => a).length * {
            'Easy': 10,
            'Medium': 20,
            'Hard': 30
          }[prev.difficulty])
        }));
      } else {
        setState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers,
          selectedAnswer: null,
          showFeedback: false
        }));
      }
    }, 2000);
  };

  const endGame = () => {
    setState(prev => ({
      ...prev,
      screen: 'results',
      highScore: Math.max(prev.highScore, prev.answers.filter(a => a).length),
      totalTokens: prev.totalTokens + (prev.answers.filter(a => a).length * {
        'Easy': 10,
        'Medium': 20,
        'Hard': 30
      }[prev.difficulty])
    }));
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
        <Brain className="w-12 h-12 text-blue-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Crypto Trivia</h1>
      <p className="text-white/60 text-center max-w-md mb-8">
        Test your cryptocurrency knowledge and earn tokens!
      </p>

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors font-medium"
        >
          Play Now
        </button>
        
        <div className="text-center">
          <div className="text-sm text-white/60">Your Tokens</div>
          <div className="text-2xl font-bold">{state.totalTokens}</div>
        </div>
      </div>
    </div>
  );

  const renderDifficultySelect = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-12">Select Difficulty</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-12">
        {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => {
          const tokens = {
            'Easy': 10,
            'Medium': 20,
            'Hard': 30
          }[difficulty];

          return (
            <button
              key={difficulty}
              onClick={() => startGame(difficulty)}
              className="w-48 p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2">{difficulty}</h3>
              <div className="text-sm text-white/60 mb-4">
                {difficulty === 'Easy' && '60 seconds'}
                {difficulty === 'Medium' && '45 seconds'}
                {difficulty === 'Hard' && '30 seconds'}
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                {tokens} TOKENS PER CORRECT
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
        className="text-white/60 hover:text-white transition-colors"
      >
        Back to Menu
      </button>
    </div>
  );

  const renderGame = () => {
    const question = questions[state.currentQuestion];
    const timeLeftPercentage = (state.timeLeft / {
      'Easy': 60,
      'Medium': 45,
      'Hard': 30
    }[state.difficulty]) * 100;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* Timer */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Timer className="w-5 h-5 text-white/60" />
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${timeLeftPercentage}%` }}
            />
          </div>
          <span className="text-white/60">{state.timeLeft}s</span>
        </div>

        {/* Progress */}
        <div className="mb-12 flex items-center gap-2">
          <span className="text-white/60">Question</span>
          <span className="font-bold">{state.currentQuestion + 1}</span>
          <span className="text-white/60">of</span>
          <span className="font-bold">{questions.length}</span>
        </div>

        {/* Question */}
        <div className="max-w-2xl text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">{question.question}</h3>
          {state.showFeedback && (
            <p className="text-white/60">{question.explanation}</p>
          )}
        </div>

        {/* Answers */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={state.showFeedback}
              className={`p-4 rounded-xl transition-all ${
                state.showFeedback
                  ? index === question.correctAnswer
                    ? 'bg-green-500/20 text-green-400'
                    : state.selectedAnswer === index
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/5 opacity-50'
                  : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{answer}</span>
                {state.showFeedback && (
                  index === question.correctAnswer ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : state.selectedAnswer === index ? (
                    <XIcon className="w-5 h-5 text-red-400" />
                  ) : null
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const correctAnswers = state.answers.filter(a => a).length;
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    const tokens = correctAnswers * {
      'Easy': 10,
      'Medium': 20,
      'Hard': 30
    }[state.difficulty];

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8">
          <Trophy className="w-12 h-12 text-blue-500" />
        </div>

        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-white/60 mb-8">Great job! Here's how you did:</p>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{percentage.toFixed(0)}%</div>
            <div className="text-sm text-white/60">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{tokens}</div>
            <div className="text-sm text-white/60">Tokens Earned</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'menu' }))}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            Back to Menu
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {state.screen === 'menu' && renderMenu()}
      {state.screen === 'difficulty' && renderDifficultySelect()}
      {state.screen === 'game' && renderGame()}
      {state.screen === 'results' && renderResults()}
    </div>
  );
};