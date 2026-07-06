import { usePomodoro } from '../../contexts/PomodoroContext';

export default function GlobalMusicPlayer() {
  const { musicData } = usePomodoro();

  if (!musicData || !musicData.isPlaying || !musicData.videoId) {
    return null;
  }

  // Use a hidden iframe to play music
  // The iframe MUST be rendered so the music can play, but we don't want it to take up any space
  return (
    <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden -z-50">
      <iframe
        width="10"
        height="10"
        src={`https://www.youtube.com/embed/${musicData.videoId}?autoplay=1&loop=1&playlist=${musicData.videoId}`}
        allow="autoplay; encrypted-media"
        title="Background Music Player"
      />
    </div>
  );
}
