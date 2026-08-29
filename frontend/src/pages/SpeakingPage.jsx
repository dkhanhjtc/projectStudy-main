import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Mic } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function SpeakingPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-extrabold flex items-center gap-3">
            <Mic className="text-secondary" size={32} />
            Speaking Modules
          </h1>
          <p className="text-muted-foreground mt-2">Practice your pronunciation and fluency.</p>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="!p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-secondary/10 border-4 border-secondary flex items-center justify-center mb-4">
            <Mic size={40} className="text-secondary" />
          </div>
          <h2 className="font-heading font-bold text-2xl mb-2">Coming Soon!</h2>
          <p className="text-muted-foreground">We are working hard to bring you the best speaking practice experience.</p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
