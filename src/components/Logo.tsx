'use client'

interface LogoProps {
  isExpanded?: boolean;
}

export default function Logo({ isExpanded = false }: LogoProps) {
  return (
    <div className="w-full h-full">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={isExpanded ? "0 0 70 16" : "0 0 70 32"}
        className="transition-all duration-300 ease-in-out"
      >
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor='#05a'/>
            <stop offset="100%" stopColor='#0a5'/>
          </linearGradient>
        </defs>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{isExpanded ? "上海市大数据股份" : "SHDATA"}</text>
      </svg>

      <style jsx>{`
        svg text {
          font-size: 1rem;
          text-transform: uppercase;
          stroke: url(#linear);
          stroke-width: 0.5px;
          fill: transparent;
          animation: moveLines 5s linear infinite;
          transition: all 0.3s ease-in-out;
        }

        @keyframes moveLines {
          0% {
            stroke-dasharray: 0px, 50px;
          }
          
          70%, 100% {
            stroke-dasharray: 50px, 0;
          } 
        }
      `}</style>
    </div>
  )
} 