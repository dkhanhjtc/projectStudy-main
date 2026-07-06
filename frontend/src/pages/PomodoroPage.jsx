import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePomodoro } from '../contexts/PomodoroContext';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { usePageVisibility } from '../hooks/usePageVisibility';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Music,
  Timer,
  Coffee,
  Sun,
  AlertTriangle,
  Video,
  Trash2
} from 'lucide-react';

function extractYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export default function PomodoroPage() {
  const {
    mode, timeLeft, isRunning, completedSessions,
    settings, MODES,
    start, pause, reset, skip,
    setMode, updateSettings, formatTime, progress,
    musicData, setMusicData, toggleMusic
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [urlInput, setUrlInput] = useState(musicData?.url || '');
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  // Custom settings temp state
  const [tempStudy, setTempStudy] = useState(settings.study / 60);
  const [tempBreak, setTempBreak] = useState(settings.break / 60);
  const [tempLongBreak, setTempLongBreak] = useState(settings.longBreak / 60);

  // Prevent accidental close
  useBeforeUnload(isRunning);

  // Page visibility warning
  const { isVisible } = usePageVisibility();
  useEffect(() => {
    if (!isVisible && isRunning) {
      setShowWarning(true);
    }
  }, [isVisible, isRunning]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const videoId = extractYoutubeId(urlInput);
    if (!videoId) {
      alert("Vui lòng nhập link YouTube hợp lệ!");
      return;
    }

    setIsLoadingMusic(true);
    
    // Set initial data
    const newMusicData = {
      url: urlInput,
      videoId,
      title: "Loading title...",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isPlaying: true
    };
    
    setMusicData(newMusicData);
    setUrlInput('');

    try {
      // Fetch title from noembed API (supports CORS)
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await res.json();
      if (data.title) {
        setMusicData({ ...newMusicData, title: data.title });
      } else {
        setMusicData({ ...newMusicData, title: "YouTube Audio" });
      }
    } catch (err) {
      console.error("Error fetching youtube title:", err);
      setMusicData({ ...newMusicData, title: "YouTube Audio" });
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      study: Math.max(1, tempStudy) * 60,
      break: Math.max(1, tempBreak) * 60,
      longBreak: Math.max(1, tempLongBreak) * 60,
    });
    setShowSettings(false);
  };

  const modeConfig = {
    [MODES.STUDY]: { label: 'Study', icon: Timer, color: 'bg-accent', ringColor: '#8B5CF6' },
    [MODES.BREAK]: { label: 'Break', icon: Coffee, color: 'bg-quaternary', ringColor: '#34D399' },
    [MODES.LONG_BREAK]: { label: 'Long Break', icon: Sun, color: 'bg-tertiary', ringColor: '#FBBF24' },
  };

  const current = modeConfig[mode];
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
            Focus <span className="squiggly-underline">Mode</span> 🎯
          </h1>
          <p className="text-muted-foreground mt-1">Stay productive with Pomodoro technique</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Settings}
          iconPosition="left"
          onClick={() => {
            setTempStudy(settings.study / 60);
            setTempBreak(settings.break / 60);
            setTempLongBreak(settings.longBreak / 60);
            setShowSettings(true);
          }}
        >
          Settings
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-3">
          <Card hover={false} className="!p-8">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-8 justify-center flex-wrap">
              {Object.entries(modeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={`
                    px-4 py-2 rounded-full
                    font-bold text-sm
                    border-2 transition-all duration-300
                    cursor-pointer
                    ${mode === key
                      ? `${cfg.color} text-white border-foreground shadow-[var(--shadow-pop-sm)]`
                      : 'bg-transparent text-muted-foreground border-transparent hover:border-border'
                    }
                  `}
                >
                  <cfg.icon size={14} strokeWidth={2.5} className="inline mr-1.5 -mt-0.5" />
                  {cfg.label}
                </button>
              ))}
            </div>

            {/* Timer Ring */}
            <div className="flex justify-center mb-8">
              <div className="relative w-72 h-72 max-md:w-56 max-md:h-56">
                <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90">
                  {/* Background ring */}
                  <circle cx="150" cy="150" r="140" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  {/* Progress ring */}
                  <motion.circle
                    cx="150" cy="150" r="140"
                    fill="none"
                    stroke={current.ringColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-5xl font-extrabold tabular-nums max-md:text-4xl">
                    {formatTime(timeLeft)}
                  </span>
                  <Badge color={mode === MODES.STUDY ? 'violet' : mode === MODES.BREAK ? 'mint' : 'yellow'} size="sm" className="mt-2">
                    {current.label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={reset}
                className="!rounded-full !w-12 !h-12"
              >
                <RotateCcw size={20} strokeWidth={2.5} />
              </Button>

              <Button
                variant="primary"
                onClick={isRunning ? pause : start}
                className="!w-20 !h-20 !rounded-full !text-lg !p-0"
              >
                {isRunning
                  ? <Pause size={32} strokeWidth={2.5} />
                  : <Play size={32} strokeWidth={2.5} className="ml-1" />
                }
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={skip}
                className="!rounded-full !w-12 !h-12"
              >
                <SkipForward size={20} strokeWidth={2.5} />
              </Button>
            </div>

            {/* Sessions counter */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Sessions completed: <span className="font-bold text-foreground">{completedSessions}</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Music Section */}
        <div className="lg:col-span-2 space-y-5">
          <Card hover={false} className="!p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-foreground flex items-center justify-center">
                <Music size={14} strokeWidth={2.5} className="text-white" />
              </div>
              <h3 className="font-heading font-bold">YouTube Background Music</h3>
            </div>

            {!musicData ? (
              <>
                <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste YouTube URL or playlist..."
                      className="
                        w-full px-3 py-2 text-sm
                        bg-input border-2 border-border rounded-[var(--radius-md)]
                        focus:outline-none focus:border-accent
                        transition-colors
                      "
                      disabled={isLoadingMusic}
                    />
                  </div>
                  <Button type="submit" size="sm" disabled={isLoadingMusic}>
                    <Video size={16} strokeWidth={2.5} />
                  </Button>
                </form>

                <div className="
                  aspect-video rounded-[var(--radius-md)]
                  border-2 border-dashed border-border
                  flex flex-col items-center justify-center
                  text-muted-foreground
                  bg-muted/50
                ">
                  <Video size={32} strokeWidth={2} className="mb-2 opacity-40" />
                  <p className="text-sm font-medium">Paste a YouTube link above</p>
                  <p className="text-xs opacity-60 mt-1">Audio will play in background</p>
                </div>
              </>
            ) : (
              <div className="relative rounded-[var(--radius-md)] overflow-hidden border-2 border-foreground shadow-[var(--shadow-pop-sm)] group aspect-video bg-black">
                <img 
                  src={musicData.thumbnail} 
                  alt={musicData.title} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${musicData.isPlaying ? 'opacity-50' : 'opacity-30'} group-hover:opacity-40`} 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                  <h4 className="font-heading font-bold text-white text-lg line-clamp-2 mb-3">
                    {musicData.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="primary" 
                      onClick={toggleMusic}
                      className="!rounded-full !w-12 !h-12 !p-0 shadow-none border-none"
                    >
                      {musicData.isPlaying ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} strokeWidth={2.5} className="ml-1" />}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => setMusicData(null)}
                      className="!rounded-full !w-10 !h-10 !p-0 bg-white/20 hover:bg-white/30 border-none text-white shadow-none"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </Button>
                    <span className="text-xs text-white/70 ml-auto font-medium tracking-wider uppercase">
                      {musicData.isPlaying ? 'Playing...' : 'Paused'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick tips */}
          <Card hover={false} shadow="mint" className="!p-4">
            <h4 className="font-heading font-bold text-sm mb-2">💡 Quick Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Focus for {settings.study / 60} min, then take a {settings.break / 60} min break</li>
              <li>• After {settings.sessionsBeforeLong} sessions, enjoy a longer break</li>
              <li>• Both Timer and Music continue playing in the background across all pages!</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Timer Settings" size="sm">
        <div className="flex flex-col gap-4">
          <Input
            id="study-duration"
            label="Study Duration (minutes)"
            type="number"
            min={1}
            max={120}
            value={tempStudy}
            onChange={(e) => setTempStudy(Number(e.target.value))}
          />
          <Input
            id="break-duration"
            label="Break Duration (minutes)"
            type="number"
            min={1}
            max={30}
            value={tempBreak}
            onChange={(e) => setTempBreak(Number(e.target.value))}
          />
          <Input
            id="long-break-duration"
            label="Long Break Duration (minutes)"
            type="number"
            min={1}
            max={60}
            value={tempLongBreak}
            onChange={(e) => setTempLongBreak(Number(e.target.value))}
          />
          <Button onClick={handleSaveSettings} className="w-full mt-2">
            Save Settings
          </Button>
        </div>
      </Modal>

      {/* Visibility Warning Modal */}
      <Modal
        isOpen={showWarning && !isVisible}
        onClose={() => setShowWarning(false)}
        title="⚠️ Timer Running!"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-tertiary/20 border-2 border-tertiary flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} strokeWidth={2.5} className="text-tertiary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your Pomodoro timer is still running! Stay focused and get back to work. 💪
          </p>
          <Button onClick={() => setShowWarning(false)} className="w-full">
            Got it!
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
