import { cn } from '@/lib/utils';
import { SparklesIcon } from 'lucide-react';

interface AiLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  text?: string;
}

export function AiLoader({ 
  size = 'md', 
  className, 
  showText = true,
  text = 'AI is thinking...'
}: AiLoaderProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const sparkleSize = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {/* Main AI Brain/Neural Network Animation */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Central core */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-80" />
        
        {/* Rotating outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
        
        {/* Inner pulsing ring */}
        <div className="absolute inset-2 rounded-full border border-purple-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* Central sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <SparklesIcon className="h-6 w-6 text-white animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
        
        {/* Neural network nodes */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const radius = size === 'sm' ? 20 : size === 'md' ? 35 : 50;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-70"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          );
        })}
        
        {/* Connecting lines (neural pathways) */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30 animate-pulse"
            style={{
              width: '100%',
              height: '1px',
              left: '0',
              top: '50%',
              transform: `rotate(${i * 60}deg)`,
              transformOrigin: 'center',
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
      
      {/* Floating sparkles around the loader */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const delay = i * 0.4;
          const duration = 2 + (i % 3);
          const size_class = sparkleSize[size];
          
          return (
            <SparklesIcon
              key={`sparkle-${i}`}
              className={cn(
                size_class,
                'absolute text-blue-400 animate-bounce opacity-60'
              )}
              style={{
                left: `${10 + (i * 10)}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>
      
      {/* AI thinking text with typing effect */}
      {showText && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            {text}
          </span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}