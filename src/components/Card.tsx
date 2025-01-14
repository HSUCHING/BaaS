interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export default function Card({ children, className = '' }: CardProps) {
    return (
      <div className={`
        bg-card 
        backdrop-blur-xs 
        rounded-lg
        transition-all 
        duration-700
        ease-[cubic-bezier(0.23,1,0.32,1)]
        shadow-[rgba(0,0,0,0.1)_0px_4px_6px_-1px,rgba(0,0,0,0.06)_0px_2px_4px_-1px]
        hover:shadow-[rgba(0,0,0,0.25)_0px_25px_50px_-12px]
        hover:bg-[rgba(44,44,46,0.95)]
        hover:translate-y-[-1px]
        ${className}
      `}>
        {children}
      </div>
    );
  }