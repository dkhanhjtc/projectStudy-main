import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Layers,
  Brain,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const deckColorMap = {
  violet: 'bg-accent',
  pink: 'bg-secondary',
  yellow: 'bg-tertiary',
  mint: 'bg-quaternary',
};

export default function QuizPage() {
  const { decks, rateCard } = useFlashcards();
  const navigate = useNavigate();

  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState([]);
  
  const [currentOptions, setCurrentOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const selectedDeck = decks.find(d => d.id === selectedDeckId);
  const cards = selectedDeck?.cards || [];
  const currentCard = cards[currentIndex];

  const startQuiz = (deckId) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck.cards.length < 4) {
      alert("A deck must have at least 4 cards to play Quiz Mode (Multiple Choice).");
      return;
    }
    setSelectedDeckId(deckId);
    setCurrentIndex(0);
    setCompleted(false);
    setResults([]);
  };

  useEffect(() => {
    if (cards.length > 0 && currentCard && !completed) {
      const wrongCards = cards.filter(c => c.id !== currentCard.id);
      const shuffledWrong = [...wrongCards].sort(() => 0.5 - Math.random());
      const selectedWrong = shuffledWrong.slice(0, 3);
      const options = [
        { id: currentCard.id, text: currentCard.back, isCorrect: true },
        ...selectedWrong.map(c => ({ id: c.id, text: c.back, isCorrect: false }))
      ];
      setCurrentOptions(options.sort(() => 0.5 - Math.random()));
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentIndex, selectedDeckId]);

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOption(option.id);
    setIsAnswered(true);
    
    // Auto rate based on correctness (Correct -> Normal, Incorrect -> Hard)
    // You could map correct to 'easy' if desired.
    const difficulty = option.isCorrect ? 'normal' : 'hard';
    setResults(prev => [...prev, { cardId: currentCard.id, difficulty }]);
    rateCard(selectedDeckId, currentCard.id, difficulty);
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const resetQuiz = () => {
    setSelectedDeckId(null);
    setCurrentIndex(0);
    setCompleted(false);
    setResults([]);
  };

  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;

  // Results summary
  const resultsSummary = useMemo(() => {
    const correct = results.filter(r => r.difficulty === 'normal').length;
    const incorrect = results.filter(r => r.difficulty === 'hard').length;
    return { correct, incorrect, total: results.length };
  }, [results]);

  // ====== DECK SELECTION ======
  if (!selectedDeckId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
            Quiz Mode 🧠
          </h1>
          <p className="text-muted-foreground mt-1">Multiple choice practice (Requires 4+ cards)</p>
        </div>

        {decks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map((deck) => {
              const hasEnoughCards = deck.cards.length >= 4;
              return (
                <Card
                  key={deck.id}
                  shadow={deck.color}
                  onClick={() => hasEnoughCards ? startQuiz(deck.id) : null}
                  className={`!p-5 ${!hasEnoughCards ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`
                      w-12 h-12 rounded-full
                      ${deckColorMap[deck.color] || 'bg-accent'}
                      flex items-center justify-center
                    `}>
                      <Brain size={22} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold">{deck.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  {!hasEnoughCards && (
                    <p className="text-xs text-destructive italic mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} /> Needs {4 - deck.cards.length} more card(s)
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card hover={false} className="!p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5 border border-border">
              <Layers size={36} strokeWidth={2.5} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-bold text-xl">No decks available</h3>
            <p className="text-muted-foreground mt-2 mb-5">Create flashcards first to start quizzing</p>
            <Button icon={ArrowRight} onClick={() => navigate('/flashcards')}>
              Go to Flashcards
            </Button>
          </Card>
        )}
      </motion.div>
    );
  }

  // ====== QUIZ COMPLETE ======
  if (completed) {
    const score = Math.round((resultsSummary.correct / resultsSummary.total) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
          className="
            w-24 h-24 rounded-full bg-tertiary
            flex items-center justify-center mx-auto mb-6
          "
        >
          <Trophy size={44} strokeWidth={2.5} className="text-white" />
        </motion.div>

        <h2 className="font-heading text-3xl font-extrabold mb-2">Quiz Complete! 🎉</h2>
        <p className="text-muted-foreground mb-8">You scored {score}% on {selectedDeck?.name}</p>

        <Card hover={false} className="!p-6 mb-6 text-left">
          <h3 className="font-heading font-bold text-lg mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2 text-white">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-heading text-2xl font-extrabold text-green-600 dark:text-green-400">{resultsSummary.correct}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase">Correct</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-2 text-white">
                <XCircle size={24} />
              </div>
              <p className="font-heading text-2xl font-extrabold text-red-600 dark:text-red-400">{resultsSummary.incorrect}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase">Incorrect</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={resetQuiz}>
            Back to Decks
          </Button>
          <Button icon={RotateCcw} iconPosition="left" onClick={() => startQuiz(selectedDeckId)}>
            Retry Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  // ====== QUIZ IN PROGRESS ======
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={resetQuiz}
            className="
              w-8 h-8 rounded-full border border-border
              flex items-center justify-center
              hover:bg-muted transition-colors cursor-pointer
            "
          >
            <ArrowRight size={14} strokeWidth={2.5} className="rotate-180" />
          </button>
          <h2 className="font-heading font-bold text-lg">{selectedDeck?.name}</h2>
        </div>
        <Badge color="violet">
          {currentIndex + 1} / {cards.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Question Card */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${currentCard?.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Card hover={false} className="!p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
              <Badge color="violet" size="sm" className="mb-4">Question</Badge>
              <p className="font-heading text-2xl font-bold max-md:text-xl">{currentCard?.front}</p>
            </Card>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {currentOptions.map((option, idx) => {
                let optionStyle = 'bg-card border-border hover:border-foreground hover:bg-muted';
                
                if (isAnswered) {
                  if (option.isCorrect) {
                    optionStyle = 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-bold';
                  } else if (option.id === selectedOption) {
                    optionStyle = 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 font-bold';
                  } else {
                    optionStyle = 'bg-card border-border opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`
                      w-full text-left p-4 rounded-xl border
                      transition-all duration-200 cursor-pointer
                      ${optionStyle}
                    `}
                  >
                    <span className="font-heading font-semibold text-lg">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-end"
          >
            <Button onClick={handleNext} icon={ArrowRight}>
              {currentIndex + 1 < cards.length ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
