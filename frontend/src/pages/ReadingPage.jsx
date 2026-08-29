import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { mockLessons } from '../lib/mockData';
import { useStats } from '../contexts/StatsContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ReadingPage() {
  const lesson = mockLessons.reading[0];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logStudyTime } = useStats();

  const currentQ = lesson.questions[currentQIndex];
  
  const handleSelect = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQ.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQIndex < lesson.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setCurrentQIndex(0); // Go back to first to review
    logStudyTime(20);
  };

  const getScore = () => {
    let correct = 0;
    lesson.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge color="secondary" size="lg" className="mb-2">Reading Comprehension</Badge>
          <h1 className="font-heading text-3xl font-extrabold">{lesson.title}</h1>
        </div>
        {isSubmitted && (
          <div className="bg-accent/10 px-4 py-2 rounded-xl border-2 border-accent text-center">
            <p className="text-sm text-accent font-bold">SCORE</p>
            <p className="text-2xl font-heading font-extrabold text-foreground">
              {getScore()} / {lesson.questions.length}
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Left Panel: Passage */}
        <Card className="!p-6 h-full flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <BookOpen size={20} className="text-secondary" />
            <h3 className="font-heading font-bold text-lg">Reading Passage</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {lesson.passage}
          </div>
        </Card>

        {/* Right Panel: Questions */}
        <Card className="!p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="font-heading font-bold text-lg">Questions</h3>
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentQIndex + 1} of {lesson.questions.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6"
            >
              <h4 className="font-bold text-xl">{currentQ.text}</h4>
              
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  const isCorrect = currentQ.correctAnswer === idx;
                  
                  let styleClass = "border-border bg-card hover:border-accent";
                  if (isSelected) styleClass = "border-accent bg-accent/10 text-accent";
                  
                  if (isSubmitted) {
                    if (isCorrect) styleClass = "border-green-500 bg-green-50 text-green-700";
                    else if (isSelected && !isCorrect) styleClass = "border-destructive bg-destructive/10 text-destructive";
                    else styleClass = "border-border bg-card opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isSubmitted}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left font-semibold transition-all flex justify-between items-center
                        ${styleClass}
                      `}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle size={20} className="text-green-500" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle size={20} className="text-destructive" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6 mt-4 border-t border-border shrink-0">
            <Button variant="outline" onClick={handlePrev} disabled={currentQIndex === 0} icon={ArrowLeft} iconPosition="left">
              Previous
            </Button>
            
            {currentQIndex < lesson.questions.length - 1 ? (
              <Button variant="secondary" onClick={handleNext} icon={ArrowRight}>
                Next
              </Button>
            ) : !isSubmitted ? (
              <Button variant="primary" onClick={handleSubmit} disabled={Object.keys(answers).length < lesson.questions.length}>
                Submit Answers
              </Button>
            ) : (
              <Button variant="ghost" disabled>Completed</Button>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
