import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-colors',
          variant === 'default' && 'bg-blue-500 text-white hover:bg-blue-600',
          variant === 'outline' && 'border-2 border-gray-200 hover:bg-gray-50',
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
