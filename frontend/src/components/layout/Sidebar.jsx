import { NavLink, useLocation } from 'react-router-dom';
import LogoDemo from '../../assets/LogoDemo.jpg';
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
  { to: '/', icon: LayoutDashboard, label: 'Home', color: 'bg-accent' },
  { to: '/vocabulary', icon: Layers, label: 'Vocabulary', color: 'bg-secondary' },
  { to: '/grammar', icon: Brain, label: 'Grammar', color: 'bg-tertiary' },
  { to: '/listening', icon: ClipboardList, label: 'Listening', color: 'bg-destructive' },
  { to: '/speaking', icon: Timer, label: 'Speaking', color: 'bg-quaternary' },
  { to: '/profile', icon: User, label: 'Profile', color: 'bg-accent' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <aside className="
      w-20 hover:w-64 h-screen sticky top-0
      bg-card border-r border-border
      flex flex-col
      py-4 px-3
      max-lg:hidden
      transition-all duration-300 ease-in-out
      group/sidebar
      overflow-x-hidden
      z-40
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6 shrink-0">
        <div className="
          w-10 h-10 rounded-full shrink-0 flex items-center justify-center
        ">
          <img
            src={LogoDemo}
            alt="Studionix Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 w-32 shrink-0">
          <h1 className="font-heading text-lg font-extrabold leading-tight">Studionix</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 p-2
                rounded-[var(--radius-md)]
                font-semibold text-sm
                transition-all duration-300
                group
                ${isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
              title={item.label}
            >
              <span className={`
                w-10 h-10 rounded-full shrink-0
                flex items-center justify-center
                transition-all duration-300
                ${isActive
                  ? `${item.color} text-white shadow-sm`
                  : 'bg-transparent text-muted-foreground'
                }
              `}>
                <item.icon size={20} strokeWidth={2.5} />
              </span>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="
        mt-auto pt-4 shrink-0
        border-t border-border
      ">
        {user ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="
              w-10 h-10 rounded-full shrink-0
              bg-tertiary
              flex items-center justify-center
              font-bold text-foreground text-sm
            ">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{user?.displayName || 'Student'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={toggleTheme}
                  className="
                    p-1.5 rounded-full
                    text-muted-foreground hover:text-foreground hover:bg-muted
                    transition-colors cursor-pointer
                  "
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={14} strokeWidth={2.5} /> : <Moon size={14} strokeWidth={2.5} />}
                </button>
                <button
                  onClick={logout}
                  className="
                    p-1.5 rounded-full
                    text-muted-foreground hover:text-destructive hover:bg-destructive/10
                    transition-colors cursor-pointer
                  "
                  title="Sign out"
                >
                  <LogOut size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2">
            <NavLink
              to="/auth"
              className="
                w-10 h-10 rounded-full shrink-0
                bg-accent text-white
                flex items-center justify-center
                shadow-sm hover:shadow-md
                transition-all duration-300
              "
              title="Sign In"
            >
              <LogOut size={18} strokeWidth={2.5} className="rotate-180" />
            </NavLink>
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 flex gap-2 items-center">
              <span className="text-sm font-bold truncate text-foreground flex-1">Sign In</span>
              <button
                onClick={toggleTheme}
                className="
                  p-2 rounded-full shrink-0
                  text-accent hover:text-foreground hover:bg-muted
                  transition-colors cursor-pointer border border-border
                "
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
