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
  ClipboardList,
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
import { homeApi } from '../lib/api';
import { useState, useEffect } from 'react';
import PathDesignModal from '../components/PathDesignModal';


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



// AUTHENTICATED DASHBOARD
function AuthenticatedDashboard() {
  const { user } = useAuth();
  const { decks } = useFlashcards();
  const { weeklyStudy, totalMinutes, streakDays, goalProgress, todayMinutes, goal, learningPath, setLearningPath } = useStats();
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    homeApi.getHomeData()
      .then(data => {
        setHomeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch home data:', err);
        setLoading(false);
      });
  }, []);


  const [showPathModal, setShowPathModal] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  const handleSavePath = (pathData) => {
    setLearningPath(pathData);
    setShowPathModal(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Path Design Banner (if no path) */}
      {!learningPath && (
        <motion.div variants={itemVariants}>
          <Card variant="primary" hover={false} className="!p-6 stripe-pattern bg-accent text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-xl mb-1">Thiết kế lộ trình học riêng của bạn</h3>
              <p className="text-white/80 text-sm">Cho chúng tôi biết mục tiêu của bạn để nhận đề xuất bài học phù hợp nhất.</p>
            </div>
            <Button variant="secondary" onClick={() => setShowPathModal(true)}>
              Thiết kế ngay
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Top Section: Pomodoro, Greeting, Music Player */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Pomodoro Widget */}
        <motion.div variants={itemVariants} className="col-span-1">
          <Card hover={false} className="h-full !p-5 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mb-3">
              <Timer size={24} className="text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg">Pomodoro Focus</h3>
            <p className="text-xs text-muted-foreground mb-4">Tập trung làm việc với kỹ thuật Pomodoro</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/pomodoro')} className="w-full">
              Mở Đồng Hồ
            </Button>
          </Card>
        </motion.div>

        {/* Center: Greeting */}
        <motion.div variants={itemVariants} className="col-span-1 flex flex-col justify-center items-center text-center">
          <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl mb-2">
            Welcome, <span>{displayName}</span>!
          </h1>
          <p className="text-muted-foreground text-sm">
            {learningPath ? `Mục tiêu: ${learningPath.goal.toUpperCase()} ${learningPath.band ? `- Band ${learningPath.band}` : ''}` : 'Ready for a productive session?'}
          </p>
        </motion.div>

        {/* Right: Music Player Widget */}
        <motion.div variants={itemVariants} className="col-span-1">
          <Card hover={false} className="h-full !p-5 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center mb-3">
              <Sparkles size={24} className="text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg">Lofi Music</h3>
            <p className="text-xs text-muted-foreground mb-4">Trích xuất nhạc và thư giãn khi học</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/pomodoro')} className="w-full">
              Mở Trình Phát
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Stats Chart */}
      <motion.div variants={itemVariants}>
        <Card variant="clean" hover={false} className="!p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading font-bold text-lg">Thống kê học tập (Tuần)</h3>
              <p className="text-sm text-muted-foreground">Tổng thời gian: {Math.floor(totalMinutes / 60)} giờ {totalMinutes % 60} phút</p>
            </div>
            <Badge color="violet" size="sm">This Week</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudy} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} unit="m" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                <Bar dataKey="minutes" fill="#8B5CF6" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* In-Progress Lessons */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-xl">Đang học dở</h3>
          </div>
          <div className="space-y-3">
            {homeData?.inProgressLessons?.length > 0 ? (
              homeData.inProgressLessons.map((lesson, index) => (
                <Card key={index} variant="clean" shadow="sm" hover={true} className="!p-4 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center border-2 border-foreground">
                        <Layers size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold">{lesson.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Tiến độ: {lesson.currentProgress}/{lesson.totalProgress} thẻ
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={ArrowRight}>Tiếp tục</Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có bài học nào đang học dở</p>
            )}
          </div>
        </motion.div>

        {/* Suggested Lessons */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-xl">Gợi ý bài học tiếp theo</h3>
          </div>
          <div className="space-y-3">
            {homeData?.suggestedLessons?.length > 0 ? (
              homeData.suggestedLessons.map((lesson, index) => (
                <Card key={index} variant="clean" shadow="sm" hover={true} className="!p-4 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-foreground">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold">{lesson.title}</h4>
                        <p className="text-xs text-muted-foreground">{lesson.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={ArrowRight}>Bắt đầu</Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có gợi ý nào</p>
            )}
          </div>
        </motion.div>
      </div>

      <PathDesignModal
        isOpen={showPathModal}
        onClose={() => setShowPathModal(false)}
        onSave={handleSavePath}
      />
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
