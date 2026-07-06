import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlashcards } from '../contexts/FlashcardContext';
import { useStats } from '../contexts/StatsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  User,
  Lock,
  Save,
  Layers,
  BookOpen,
  Clock,
  Flame,
  Target,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function ProfilePage() {
  const { user, updateUserProfile, changePassword } = useAuth();
  const { totalDecks, totalCards } = useFlashcards();
  const { totalMinutes, streakDays, goal, setGoal } = useStats();

  // Profile form
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Goal form
  const [goalMinutes, setGoalMinutes] = useState(goal.minutesPerDay);
  const [goalSaved, setGoalSaved] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      await updateUserProfile({ displayName });
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      const messages = {
        'auth/wrong-password': 'Current password is incorrect',
        'auth/weak-password': 'New password is too weak',
      };
      setPasswordError(messages[err.code] || err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveGoal = () => {
    setGoal({ minutesPerDay: goalMinutes, active: true });
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 3000);
  };

  const totalHours = Math.floor(totalMinutes / 60);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
          Profile & <span className="squiggly-underline">Settings</span> ⚙️
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and study goals</p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Decks Created', value: totalDecks, icon: Layers, color: 'bg-accent' },
          { label: 'Total Cards', value: totalCards, icon: BookOpen, color: 'bg-secondary' },
          { label: 'Study Hours', value: `${totalHours}h`, icon: Clock, color: 'bg-tertiary' },
          { label: 'Day Streak', value: `${streakDays}🔥`, icon: Flame, color: 'bg-quaternary' },
        ].map((stat) => (
          <Card key={stat.label} variant="clean" hover={false} shadow="default" className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full ${stat.color}
                border-2 border-foreground
                flex items-center justify-center flex-shrink-0
              `}>
                <stat.icon size={18} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-heading font-extrabold leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Update Profile */}
        <motion.div variants={itemVariants}>
          <Card variant="clean" hover={false} icon={User} iconColor="bg-accent" className="!pt-8">
            <h3 className="font-heading font-bold text-lg mb-4">Update Information</h3>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <Input
                id="profile-name"
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                id="profile-email"
                label="Email"
                value={user?.email || ''}
                disabled
                className="opacity-60"
              />

              {profileSuccess && (
                <p className="text-sm text-success font-semibold bg-success/10 border-2 border-success rounded-[var(--radius-md)] px-3 py-2">
                  ✅ {profileSuccess}
                </p>
              )}
              {profileError && (
                <p className="text-sm text-destructive font-semibold bg-destructive/10 border-2 border-destructive rounded-[var(--radius-md)] px-3 py-2">
                  {profileError}
                </p>
              )}

              <Button type="submit" loading={profileLoading} icon={Save} iconPosition="left" className="w-full">
                Save Changes
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div variants={itemVariants}>
          <Card variant="clean" hover={false} icon={Lock} iconColor="bg-secondary" className="!pt-8">
            <h3 className="font-heading font-bold text-lg mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <Input
                id="current-password"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Input
                id="new-password"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Input
                id="confirm-new-password"
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {passwordSuccess && (
                <p className="text-sm text-success font-semibold bg-success/10 border-2 border-success rounded-[var(--radius-md)] px-3 py-2">
                  ✅ {passwordSuccess}
                </p>
              )}
              {passwordError && (
                <p className="text-sm text-destructive font-semibold bg-destructive/10 border-2 border-destructive rounded-[var(--radius-md)] px-3 py-2">
                  {passwordError}
                </p>
              )}

              <Button type="submit" loading={passwordLoading} variant="secondary" className="w-full">
                Change Password
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Goals */}
      <motion.div variants={itemVariants}>
        <Card variant="clean" hover={false} icon={Target} iconColor="bg-tertiary" className="!pt-8">
          <h3 className="font-heading font-bold text-lg mb-2">Weekly Study Goals</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Set a daily study target to build consistency
          </p>

          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
                Daily Study Goal (minutes)
              </label>
              <div className="flex gap-2">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setGoalMinutes(mins)}
                    className={`
                      px-3 py-2 rounded-full text-sm font-bold
                      border-2 transition-all cursor-pointer
                      ${goalMinutes === mins
                        ? 'bg-tertiary border-foreground text-foreground shadow-[var(--shadow-pop-sm)]'
                        : 'bg-transparent border-border text-muted-foreground hover:border-foreground'
                      }
                    `}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  min={10}
                  max={240}
                  step={5}
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(Number(e.target.value))}
                  className="w-full accent-tertiary"
                />
                <p className="text-sm mt-1">
                  Current goal: <span className="font-bold text-tertiary">{goalMinutes} min/day</span>
                  <span className="text-muted-foreground"> ({(goalMinutes / 60).toFixed(1)} hours)</span>
                </p>
              </div>
            </div>
            <div>
              <Button
                onClick={handleSaveGoal}
                icon={Save}
                iconPosition="left"
                className="w-full"
                variant={goalSaved ? 'secondary' : 'primary'}
              >
                {goalSaved ? '✅ Saved!' : 'Set Goal'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
