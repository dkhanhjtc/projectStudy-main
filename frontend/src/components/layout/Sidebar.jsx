import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeProvider';
import {
  LayoutDashboard,
  Layers,
  Brain,
  Timer,
  User,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  ClipboardList,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'bg-accent' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards', color: 'bg-secondary' },
  { to: '/quiz', icon: Brain, label: 'Quiz', color: 'bg-tertiary' },
  { to: '/exam', icon: ClipboardList, label: 'Mock Exam', color: 'bg-destructive' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro', color: 'bg-quaternary' },
  { to: '/profile', icon: User, label: 'Profile', color: 'bg-accent' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside className="
      w-64 min-h-screen
      bg-card border-r border-border
      flex flex-col
      p-4
      max-lg:hidden
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="
          w-10 h-10 rounded-full
          bg-accent
          flex items-center justify-center
        ">
          <Sparkles size={20} strokeWidth={2.5} className="text-white" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-extrabold leading-tight">LEA</h1>
          <p className="text-xs text-muted-foreground font-medium">Learn – Explore – Achieve</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-3 py-2.5
                rounded-[var(--radius-md)]
                font-semibold text-sm
                transition-all duration-300
                group
                ${isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <span className={`
                w-8 h-8 rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${isActive
                  ? `${item.color} text-white shadow-sm`
                  : 'bg-transparent text-muted-foreground'
                }
              `}>
                <item.icon size={16} strokeWidth={2.5} />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="
        mt-auto pt-4
        border-t border-border
      ">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="
              w-9 h-9 rounded-full
              bg-tertiary
              flex items-center justify-center
              font-bold text-foreground text-sm
            ">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.displayName || 'Student'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={toggleTheme}
                className="
                  p-2 rounded-full
                  text-muted-foreground hover:text-foreground hover:bg-muted
                  transition-colors cursor-pointer
                "
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
              </button>
              <button
                onClick={logout}
                className="
                  p-2 rounded-full
                  text-muted-foreground hover:text-destructive hover:bg-destructive/10
                  transition-colors cursor-pointer
                "
                title="Sign out"
              >
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/auth"
              className="
                flex-1 flex items-center gap-3 px-3 py-2.5
                rounded-full
                bg-accent text-white font-bold text-sm
                shadow-sm hover:shadow-md
                hover:-translate-y-0.5
                transition-all duration-300
                justify-center
              "
            >
              <LogOut size={16} strokeWidth={2.5} className="rotate-180 text-white " />
              Sign In
            </NavLink>
            <button
              onClick={toggleTheme}
              className="
                p-2.5 rounded-full
                text-accent hover:text-foreground hover:bg-muted
                transition-colors cursor-pointer border border-border
              "
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
