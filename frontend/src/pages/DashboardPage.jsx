import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useStats } from '../contexts/StatsContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FloatingShapes from '../components/ui/FloatingShapes';
import {
  ArrowRight,
  Layers,
  Clock,
  Flame,
  Target,
  BookOpen,
  RotateCcw,
  Sparkles,
  Brain,
  Timer,
  LogIn,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const deckColors = {
  violet: 'bg-accent',
  pink: 'bg-secondary',
  yellow: 'bg-tertiary',
  mint: 'bg-quaternary',
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="
        bg-card border-2 border-foreground
        rounded-[var(--radius-md)]
        shadow-[var(--shadow-pop-sm)]
        px-3 py-2
      ">
        <p className="text-xs font-bold">{label}</p>
        <p className="text-sm text-accent font-bold">{payload[0].value} min</p>
      </div>
    );
  }
  return null;
}

// ============================================
// GUEST DASHBOARD (not logged in)
// ============================================
function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative"
    >
      <FloatingShapes />

      {/* Hero Greeting */}
      <motion.div variants={itemVariants} className="text-center py-8 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
          className="
            w-20 h-20 rounded-full bg-accent
            border-2 border-foreground
            shadow-[var(--shadow-pop)]
            flex items-center justify-center mx-auto mb-6
          "
        >
          <Sparkles size={36} strokeWidth={2.5} className="text-white" />
        </motion.div>

        <h1 className="font-heading text-4xl font-extrabold max-md:text-2xl text-center">
          Welcome to LEA!
          <motion.span
            className="inline-block ml-2"
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          >
            🎉
          </motion.span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-xl mx-auto text-center">
          Your playful companion for flashcards, quizzes, and focused study sessions. Learn – Explore – Achieve.
        </p>

        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <Button
            variant="primary"
            icon={LogIn}
            iconPosition="left"
            onClick={() => navigate('/auth')}
          >
            Sign In to Get Started
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/auth')}
          >
            Create Account
          </Button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            icon: Layers,
            color: 'bg-accent',
            shadow: 'violet',
            title: 'Smart Flashcards',
            desc: 'Create decks, add question & answer cards, and organize your study material.',
          },
          {
            icon: Brain,
            color: 'bg-secondary',
            shadow: 'pink',
            title: 'Quiz Mode',
            desc: 'Test yourself with interactive card flips and rate your recall difficulty.',
          },
          {
            icon: Timer,
            color: 'bg-tertiary',
            shadow: 'yellow',
            title: 'Pomodoro Focus',
            desc: 'Stay productive with timed study sessions and background music.',
          },
        ].map((feature) => (
          <Card key={feature.title} shadow={feature.shadow} icon={feature.icon} iconColor={feature.color} className="!pt-8">
            <h3 className="font-heading font-bold text-lg mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </Card>
        ))}
      </motion.div>

      {/* Login prompt */}
      <motion.div variants={itemVariants}>
        <Card hover={false} className="!p-8 text-center stripe-pattern">
          <div className="w-16 h-16 rounded-full bg-tertiary border-2 border-foreground shadow-[var(--shadow-pop)] flex items-center justify-center mx-auto mb-4">
            <LogIn size={28} strokeWidth={2.5} className="text-white" />
          </div>
          <h3 className="font-heading font-bold text-xl mb-2">
            Sign in to unlock your dashboard
          </h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
            View your stats, manage flashcards, take quizzes, and track your study progress — all personalized to you.
          </p>
          <Button variant="primary" icon={ArrowRight} onClick={() => navigate('/auth')}>
            Sign In Now
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// AUTHENTICATED DASHBOARD
// ============================================
function AuthenticatedDashboard() {
  const { user } = useAuth();
  const { decks } = useFlashcards();
  const { weeklyStudy, totalMinutes, streakDays, goalProgress, todayMinutes, goal } = useStats();
  const navigate = useNavigate();

  const recentCards = decks
    .flatMap(d => d.cards.map(c => ({ ...c, deckName: d.name, deckColor: d.color, deckId: d.id })))
    .sort((a, b) => {
      if (a.lastStudied && b.lastStudied) return new Date(b.lastStudied) - new Date(a.lastStudied);
      if (a.lastStudied) return -1;
      return 1;
    })
    .slice(0, 6);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const totalHours = Math.floor(totalMinutes / 60);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
            Welcome back, <span className="squiggly-underline-violet">{displayName}</span>! 
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Ready for another productive study session?
          </p>
        </div>
        <Button
          variant="primary"
          icon={ArrowRight}
          onClick={() => navigate('/quiz')}
        >
          Start Quiz
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Decks', value: decks.length, icon: Layers, color: 'bg-accent' },
          { label: 'Total Cards', value: decks.reduce((s, d) => s + d.cards.length, 0), icon: BookOpen, color: 'bg-secondary' },
          { label: 'Study Hours', value: `${totalHours}h`, icon: Clock, color: 'bg-tertiary' },
          { label: 'Day Streak', value: streakDays, icon: Flame, color: 'bg-quaternary' },
        ].map((stat) => (
          <Card key={stat.label} variant="clean" hover={false} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full ${stat.color}
                border-2 border-foreground
                flex items-center justify-center flex-shrink-0
              `}>
                <stat.icon size={18} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-heading font-extrabold leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Weekly Stats Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card variant="clean" hover={false} className="!p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading font-bold text-lg">Weekly Statistics</h3>
                <p className="text-sm text-muted-foreground">Your study time this week</p>
              </div>
              <Badge color="violet" size="sm">
                This Week
              </Badge>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudy} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="m"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                  <Bar
                    dataKey="minutes"
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Daily Goal */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card variant="clean" hover={false} className="!p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center">
                <Target size={16} strokeWidth={2.5} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg">Daily Goal</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="#8B5CF6" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - goalProgress / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-2xl font-extrabold">{Math.round(goalProgress)}%</span>
                  <span className="text-xs text-muted-foreground font-semibold">complete</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold">
                  <span className="text-accent font-bold">{todayMinutes} min</span>
                  {' / '}
                  <span className="text-muted-foreground">{goal.minutesPerDay} min goal</span>
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/profile')}
            >
              Adjust Goal
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Recently Learned */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-xl">
            Recently Learned <span className="squiggly-underline">Flashcards</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/flashcards')}
          >
            See More
          </Button>
        </div>

        {recentCards.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCards.map((card) => (
              <motion.div key={card.id} variants={itemVariants}>
                <Card variant="clean" shadow="default" className="!p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`
                      w-8 h-8 rounded-full flex-shrink-0
                      ${deckColors[card.deckColor] || 'bg-accent'}
                      border-2 border-foreground
                      flex items-center justify-center
                    `}>
                      <RotateCcw size={14} strokeWidth={2.5} className="text-white" />
                    </div>
                    <Badge color={card.deckColor === 'pink' ? 'pink' : card.deckColor === 'yellow' ? 'yellow' : 'violet'} size="sm">
                      {card.deckName}
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm line-clamp-2">{card.front}</p>
                  {card.difficulty && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Rated: <span className="font-bold capitalize">{card.difficulty}</span>
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card variant="clean" hover={false} className="!p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} strokeWidth={2.5} className="text-muted-foreground" />
            </div>
            <h4 className="font-heading font-bold">No cards yet!</h4>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first flashcard deck to get started</p>
            <Button variant="primary" onClick={() => navigate('/flashcards')} icon={ArrowRight}>
              Create Deck
            </Button>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN EXPORT — Switch between guest / authed
// ============================================
export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <AuthenticatedDashboard /> : <GuestDashboard />;
}
