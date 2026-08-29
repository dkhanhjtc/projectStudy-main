import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MiniPlayer from './MiniPlayer';
import GlobalMusicPlayer from './GlobalMusicPlayer';
import {
  LayoutDashboard,
  Layers,
  Brain,
  Timer,
  User,
  ClipboardList,
} from 'lucide-react';

const mobileNav = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/vocabulary', icon: Layers, label: 'Vocabulary' },
  { to: '/grammar', icon: Brain, label: 'Grammar' },
  { to: '/listening', icon: ClipboardList, label: 'Listening' },
  { to: '/speaking', icon: Timer, label: 'Speaking' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-lg:pb-20">
        <div className="max-w-6xl mx-auto px-6 py-8 max-lg:px-4 max-lg:py-5">
          <Outlet />
        </div>
      </main>

      {/* Mini Player (Pomodoro background mode) */}
      <MiniPlayer />

      {/* Global Music Player (Hidden iframe) */}
      <GlobalMusicPlayer />

      {/* Mobile Bottom Navigation */}
      <nav className="
        lg:hidden
        fixed bottom-0 left-0 right-0 z-30
        bg-card border-t border-border shadow-lg
        flex items-center justify-around
        px-2 py-1
        safe-area-inset-bottom
      ">
        {mobileNav.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex flex-col items-center gap-0.5
                px-3 py-1.5
                rounded-[var(--radius-md)]
                transition-all duration-200
                min-w-[56px]
                ${isActive
                  ? 'text-accent'
                  : 'text-muted-foreground'
                }
              `}
            >
              <span className={`
                w-8 h-8 rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${isActive
                  ? 'bg-accent text-white shadow-sm -translate-y-1'
                  : ''
                }
              `}>
                <item.icon size={18} strokeWidth={2.5} />
              </span>
              <span className={`
                text-[10px] font-bold
                ${isActive ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
