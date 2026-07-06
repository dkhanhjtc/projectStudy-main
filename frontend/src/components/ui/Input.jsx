import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`
            w-full px-4 py-3
            bg-input
            border rounded-[var(--radius-md)]
            text-foreground text-base
            placeholder:text-muted-foreground/50
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
            ${error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-border'
            }
            ${isPassword ? 'pr-12' : ''}
          `.trim()}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff size={18} strokeWidth={2.5} />
              : <Eye size={18} strokeWidth={2.5} />
            }
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
