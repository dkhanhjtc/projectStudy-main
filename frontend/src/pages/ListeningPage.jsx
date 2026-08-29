import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Play, Pause, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { mockLessons } from '../lib/mockData';
import { useStats } from '../contexts/StatsContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function ListeningPage() {
  const lesson = mockLessons.listening[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const audioRef = useRef(null);
  const { logStudyTime } = useStats();

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const checkAnswer = () => {
    // Basic word-by-word comparison for dictation
    const expectedWords = lesson.transcript.toLowerCase().replace(/[.,!?;:]/g, '').split(' ');
    const userWords = userInput.toLowerCase().replace(/[.,!?;:]/g, '').split(' ');
    
    let correctCount = 0;
    expectedWords.forEach((word, index) => {
      if (userWords[index] === word) correctCount++;
    });

    setScore({ correct: correctCount, total: expectedWords.length });
    setIsSubmitted(true);
    
    // Log study time (e.g. 15 mins for completing a lesson)
    logStudyTime(15);
  };

  const reset = () => {
    setUserInput('');
    setIsSubmitted(false);
    setScore({ correct: 0, total: 0 });
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={itemVariants} className="text-center mb-8">
        <Badge color="destructive" size="lg" className="mb-4">Listening Practice</Badge>
        <h1 className="font-heading text-3xl font-extrabold">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2">Listen to the audio and type what you hear exactly.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="!p-8 text-center space-y-6">
          {/* Audio Player UI */}
          <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 border-4 border-destructive flex items-center justify-center shadow-lg">
            <button 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-destructive text-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
            </button>
          </div>
          <audio 
            ref={audioRef} 
            src={lesson.audioUrl} 
            onEnded={() => setIsPlaying(false)} 
            className="hidden" 
          />

          <div className="text-left space-y-2 mt-8">
            <label className="font-bold text-sm ml-1">Type your dictation here:</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isSubmitted}
              className={`
                w-full h-40 p-4 rounded-xl border-2 resize-none
                ${isSubmitted ? 'bg-muted border-border text-muted-foreground' : 'bg-card border-border focus:border-accent outline-none'}
                transition-colors
              `}
              placeholder="Listen carefully and type..."
            />
          </div>

          {!isSubmitted ? (
            <Button variant="primary" className="w-full" onClick={checkAnswer} disabled={!userInput.trim()}>
              Submit & Check
            </Button>
          ) : (
            <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
              <div className="p-4 rounded-xl border-2 border-border bg-card text-left">
                <h4 className="font-bold mb-2">Original Transcript:</h4>
                <p className="text-foreground">{lesson.transcript}</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold font-heading text-accent">{Math.round((score.correct / score.total) * 100)}%</p>
                  <p className="text-xs text-muted-foreground font-bold">ACCURACY</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-left">
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle size={16} /> {score.correct} words correct
                  </div>
                  <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                    <XCircle size={16} /> {score.total - score.correct} words wrong or missing
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={reset} icon={RotateCcw}>
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
