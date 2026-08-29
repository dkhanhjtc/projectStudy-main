import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Layers, ArrowRight, BookOpen, Brain } from 'lucide-react';
import { mockLessons } from '../lib/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function VocabularyPage() {
  const navigate = useNavigate();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold flex items-center gap-3">
            <Layers className="text-accent" size={32} />
            Vocabulary Modules
          </h1>
          <p className="text-muted-foreground mt-2">Select a lesson to improve your vocabulary.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLessons.vocabulary.map((lesson) => (
          <motion.div key={lesson.id} variants={itemVariants}>
            <Card hover className="!p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center border-2 border-foreground
                  ${lesson.type === 'flashcard' ? 'bg-secondary text-white' : 'bg-accent text-white'}
                `}>
                  {lesson.type === 'flashcard' ? <Layers size={24} /> : <Brain size={24} />}
                </div>
                <Badge color={lesson.type === 'flashcard' ? 'pink' : 'violet'}>
                  {lesson.type === 'flashcard' ? 'Flashcards' : 'Quiz'}
                </Badge>
              </div>
              
              <h3 className="font-heading font-bold text-xl mb-2">{lesson.title}</h3>
              
              <div className="mt-auto pt-4 space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">{lesson.progress} words</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${lesson.type === 'flashcard' ? 'bg-secondary' : 'bg-accent'}`} 
                    style={{ width: `${(parseInt(lesson.progress.split('/')[0]) / parseInt(lesson.progress.split('/')[1])) * 100}%` }}
                  />
                </div>
                
                <Button 
                  variant={lesson.type === 'flashcard' ? 'secondary' : 'primary'} 
                  className="w-full" 
                  icon={ArrowRight}
                  onClick={() => navigate(`/${lesson.type === 'flashcard' ? 'flashcards' : 'quiz'}`)}
                >
                  Start Lesson
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
