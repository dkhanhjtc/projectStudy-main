import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Layers,
  ClipboardList,
  Clock,
  AlertTriangle,
  XCircle,
  Play
} from 'lucide-react';

const deckColorMap = {
  violet: 'bg-accent',
  pink: 'bg-secondary',
  yellow: 'bg-tertiary',
  mint: 'bg-quaternary',
};

// Formats seconds into MM:SS
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function ExamPage() {
  const { decks } = useFlashcards();
  const navigate = useNavigate();

  // STAGES: 'select_deck' | 'config' | 'running' | 'results'
  const [stage, setStage] = useState('select_deck');
  
  // CONFIG STATE
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [questionCount, setQuestionCount] = useState(10);
  
  // RUNNING STATE
  const [examCards, setExamCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({}); // key: cardId, value: optionId selected

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (stage === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timeLeft]);

  const selectDeckForExam = (deckId) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck.cards.length < 4) {
      alert("A deck must have at least 4 cards to take a Mock Exam.");
      return;
    }
    setSelectedDeckId(deckId);
    setQuestionCount(Math.min(10, deck.cards.length));
    setStage('config');
  };

  const startExam = (e) => {
    e.preventDefault();
    if (!selectedDeck) return;
    
    // Pick N random cards
    const shuffled = [...selectedDeck.cards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, questionCount);
    
    // Pre-generate options for each card to keep them stable
    const cardsWithOptions = selectedCards.map(card => {
      const wrongCards = selectedDeck.cards.filter(c => c.id !== card.id);
      const shuffledWrong = [...wrongCards].sort(() => 0.5 - Math.random());
      const selectedWrong = shuffledWrong.slice(0, 3);
      const options = [
        { id: card.id, text: card.back, isCorrect: true },
        ...selectedWrong.map(c => ({ id: c.id, text: c.back, isCorrect: false }))
      ];
      return {
        ...card,
        options: options.sort(() => 0.5 - Math.random())
      };
    });

    setExamCards(cardsWithOptions);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(timeLimitMinutes * 60);
    setStage('running');
  };

  const handleSelectOption = (option) => {
    const currentCard = examCards[currentIndex];
    
    // Save answer
    setAnswers(prev => ({ ...prev, [currentCard.id]: option }));
    
    // Auto proceed to next question
    if (currentIndex + 1 < examCards.length) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    }
  };

  const submitExam = () => {
    setStage('results');
  };

  const resetExam = () => {
    setSelectedDeckId(null);
    setStage('select_deck');
  };

  // ====== STAGE: SELECT DECK ======
  if (stage === 'select_deck') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
            Mock Exam 📝
          </h1>
          <p className="text-muted-foreground mt-1">Test your knowledge with a timed exam.</p>
        </div>

        {decks.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map((deck) => {
              const hasEnoughCards = deck.cards.length >= 4;
              return (
                <Card
                  key={deck.id}
                  shadow={deck.color}
                  onClick={() => hasEnoughCards ? selectDeckForExam(deck.id) : null}
                  className={`!p-5 ${!hasEnoughCards ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`
                      w-12 h-12 rounded-full
                      ${deckColorMap[deck.color] || 'bg-accent'}
                      flex items-center justify-center
                    `}>
                      <ClipboardList size={22} strokeWidth={2.5} className="text-white" />
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
            <p className="text-muted-foreground mt-2 mb-5">Create flashcards first to start an exam</p>
            <Button icon={ArrowRight} onClick={() => navigate('/flashcards')}>
              Go to Flashcards
            </Button>
          </Card>
        )}
      </motion.div>
    );
  }

  // ====== STAGE: CONFIG ======
  if (stage === 'config') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto py-12"
      >
        <Card hover={false} className="!p-8">
          <h2 className="font-heading text-2xl font-bold mb-2">Exam Setup</h2>
          <p className="text-muted-foreground mb-6">Configure your mock exam for <span className="font-bold text-foreground">{selectedDeck?.name}</span></p>
          
          <form onSubmit={startExam} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Number of Questions
              </label>
              <div className="flex items-center justify-between bg-input border border-border rounded-[var(--radius-md)] p-2">
                <input
                  type="range"
                  min="4"
                  max={selectedDeck?.cards.length}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full mr-4 accent-accent"
                />
                <span className="font-bold bg-muted px-3 py-1 rounded-md min-w-[3rem] text-center">
                  {questionCount}
                </span>
              </div>
            </div>

            <Input
              label="Time Limit (Minutes)"
              type="number"
              min="1"
              max="120"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              required
            />

            <div className="flex gap-3 mt-4">
              <Button type="button" variant="secondary" onClick={() => setStage('select_deck')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={Play} className="flex-1">
                Start Exam
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    );
  }

  // ====== STAGE: RUNNING ======
  if (stage === 'running') {
    const currentCard = examCards[currentIndex];
    const progress = ((currentIndex) / examCards.length) * 100;
    const isLastQuestion = currentIndex === examCards.length - 1;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-heading font-bold text-lg">{selectedDeck?.name} Exam</h2>
          
          <div className="flex items-center gap-4">
            <div className={`
              flex items-center gap-2 font-mono font-bold px-4 py-1.5 rounded-full
              ${timeLeft < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}
            `}>
              <Clock size={16} />
              {formatTime(timeLeft)}
            </div>
            <Button variant="danger" size="sm" onClick={submitExam}>
              Submit Early
            </Button>
          </div>
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

        {/* Question Area */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`exam-q-${currentCard?.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card hover={false} className="!p-8 min-h-[160px] flex flex-col items-center justify-center text-center mb-6">
                <Badge color="violet" size="sm" className="mb-4">Question {currentIndex + 1} of {examCards.length}</Badge>
                <p className="font-heading text-2xl font-bold max-md:text-xl">{currentCard?.front}</p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCard?.options.map((option, idx) => {
                  const isSelected = answers[currentCard.id]?.id === option.id;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      className={`
                        w-full text-left p-4 rounded-xl border
                        transition-all duration-200 cursor-pointer
                        ${isSelected 
                          ? 'bg-accent/10 border-accent text-accent font-bold ring-2 ring-accent/20' 
                          : 'bg-card border-border hover:border-foreground hover:bg-muted font-semibold'}
                      `}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-12">
          <Button 
            variant="secondary" 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <Button 
            variant={isLastQuestion ? 'primary' : 'secondary'}
            onClick={() => {
              if (isLastQuestion) submitExam();
              else setCurrentIndex(prev => prev + 1);
            }}
          >
            {isLastQuestion ? 'Submit Exam' : 'Next Question'}
          </Button>
        </div>
      </div>
    );
  }

  // ====== STAGE: RESULTS ======
  if (stage === 'results') {
    let correctCount = 0;
    const reviewList = [];

    examCards.forEach(card => {
      const selected = answers[card.id];
      if (selected && selected.isCorrect) {
        correctCount++;
      } else {
        reviewList.push({ card, selected });
      }
    });

    const score = Math.round((correctCount / examCards.length) * 100);
    const timeUsed = (timeLimitMinutes * 60) - timeLeft;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto py-8"
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20">
            <Trophy size={44} strokeWidth={2.5} className="text-white" />
          </div>
          <h2 className="font-heading text-4xl font-extrabold mb-2">Exam Finished</h2>
          <p className="text-muted-foreground">You completed the {selectedDeck?.name} exam in {formatTime(timeUsed)}.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="!p-4 text-center">
            <p className="text-muted-foreground text-xs font-bold uppercase mb-1">Score</p>
            <p className="font-heading text-2xl font-extrabold text-accent">{score}%</p>
          </Card>
          <Card hover={false} className="!p-4 text-center">
            <p className="text-muted-foreground text-xs font-bold uppercase mb-1">Total Questions</p>
            <p className="font-heading text-2xl font-extrabold">{examCards.length}</p>
          </Card>
          <Card hover={false} className="!p-4 text-center">
            <p className="text-muted-foreground text-xs font-bold uppercase mb-1">Correct</p>
            <p className="font-heading text-2xl font-extrabold text-green-500">{correctCount}</p>
          </Card>
          <Card hover={false} className="!p-4 text-center">
            <p className="text-muted-foreground text-xs font-bold uppercase mb-1">Incorrect / Skipped</p>
            <p className="font-heading text-2xl font-extrabold text-red-500">{examCards.length - correctCount}</p>
          </Card>
        </div>

        {reviewList.length > 0 && (
          <div className="mb-8">
            <h3 className="font-heading font-bold text-xl mb-4">Questions to Review</h3>
            <div className="flex flex-col gap-4">
              {reviewList.map((item, idx) => (
                <Card key={idx} hover={false} className="!p-5">
                  <p className="font-bold text-lg mb-4">{item.card.front}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                      <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-xs uppercase mb-0.5">Correct Answer</span>
                        {item.card.back}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400">
                      <XCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-xs uppercase mb-0.5">Your Answer</span>
                        {item.selected ? item.selected.text : <i className="opacity-70">Skipped</i>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={resetExam} icon={ArrowRight}>
            Done
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
}
