import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', className = '', children, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };
  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:from-sky-600 hover:to-cyan-600',
    secondary: 'bg-white text-sky-700 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 shadow-sm',
    ghost: 'text-sky-700 hover:bg-sky-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6' }) => (
  <div className={`bg-white/85 backdrop-blur-md rounded-2xl border border-sky-100 shadow-lg shadow-sky-900/5 ${padding} ${className}`}>
    {children}
  </div>
);

export const ProgressBar: React.FC<{ value: number; max: number; className?: string }> = ({ value, max, className = '' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-2.5 bg-sky-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: ReactNode; color?: string }> = ({ children, color = 'bg-sky-100 text-sky-700' }) => (
  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
    {children}
  </span>
);

export const StatChip: React.FC<{ label: string; value: ReactNode; icon?: string }> = ({ label, value, icon }) => (
  <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-white/70 border border-sky-100 min-w-[80px]">
    {icon && <span className="text-lg" aria-hidden>{icon}</span>}
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <span className="text-base font-bold text-sky-800">{value}</span>
  </div>
);