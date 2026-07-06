import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FloatingShapes from '../components/ui/FloatingShapes';
import { ArrowRight, Sparkles, BookOpen, Brain } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/');
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak',
        'auth/invalid-credential': 'Invalid email or password',
      };
      setError(messages[err.code] || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <FloatingShapes />

      {/* Left — Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="
              w-12 h-12 rounded-full
              bg-accent
              flex items-center justify-center
            ">
              <Sparkles size={24} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold">LEA</h1>
              <p className="text-sm text-muted-foreground font-medium">Learn – Explore – Achieve</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="
            bg-card border border-border
            rounded-[var(--radius-lg)]
            shadow-[var(--shadow-card-soft)]
            p-8
          ">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <h2 className="font-heading text-2xl font-bold mb-1">
                  {isLogin ? 'Welcome back! 👋' : 'Join the fun! 🎉'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {isLogin
                    ? 'Sign in to continue your study journey'
                    : 'Create your account and start learning'
                  }
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {!isLogin && (
                    <Input
                      id="name"
                      label="Your Name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}

                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="hello@lea.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {!isLogin && (
                    <Input
                      id="confirm-password"
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="
                        bg-destructive/10 text-destructive
                        border-2 border-destructive
                        rounded-[var(--radius-md)]
                        px-4 py-2.5
                        text-sm font-medium
                      "
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    icon={ArrowRight}
                    loading={loading}
                    className="w-full mt-2"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={toggle}
                  className="
                    ml-1.5 font-bold text-accent
                    hover:text-secondary transition-colors
                    cursor-pointer underline decoration-2 decoration-accent/30
                    hover:decoration-secondary
                  "
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — Decoration Side (Desktop Only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        {/* Big yellow circle */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-tertiary/30 -top-10 -right-20" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-secondary/20 bottom-20 left-10" />

        {/* Dot grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-30" />

        {/* Central illustration block */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Feature cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="
              bg-card border-2 border-foreground
              rounded-[var(--radius-lg)]
              shadow-[var(--shadow-card-pink)]
              p-5 w-56
              blob-speech
            "
          >
            <div className="w-10 h-10 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center mb-3">
              <BookOpen size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <h4 className="font-heading font-bold text-sm">Smart Flashcards</h4>
            <p className="text-xs text-muted-foreground mt-1">Create, study, and master any topic</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="
              bg-card border-2 border-foreground
              rounded-[var(--radius-lg)]
              shadow-[var(--shadow-card-yellow)]
              p-5 w-56
              ml-20
            "
          >
            <div className="w-10 h-10 rounded-full bg-tertiary border-2 border-foreground flex items-center justify-center mb-3">
              <Brain size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <h4 className="font-heading font-bold text-sm">Quiz Mode</h4>
            <p className="text-xs text-muted-foreground mt-1">Test yourself with interactive quizzes</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="
              bg-card border-2 border-foreground
              rounded-[var(--radius-lg)]
              shadow-[var(--shadow-card-mint)]
              p-5 w-56
              -ml-8
            "
          >
            <div className="w-10 h-10 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center mb-3">
              <Sparkles size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <h4 className="font-heading font-bold text-sm">Pomodoro Focus</h4>
            <p className="text-xs text-muted-foreground mt-1">Stay productive with timed sessions</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
