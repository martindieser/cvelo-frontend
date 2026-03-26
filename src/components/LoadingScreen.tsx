import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        {/* Logo con rotación y escalado */}
        <div className="w-32 h-32 flex items-center justify-center animate-logo-combined">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 220"
            className="w-full h-full drop-shadow-md"
          >
            <path
              d="M52,45 L130,45 L155,70 L155,175 Q155,182 148,182 L52,182 Q45,182 45,175 L45,52 Q45,45 52,45 Z"
              fill="#4CAF50"
            />
            <path d="M130,45 L155,70 L130,70 Z" fill="#388E3C" />
            <circle cx="84" cy="100" r="15" fill="#FFFFFF" />
            <circle cx="116" cy="100" r="15" fill="#FFFFFF" />
            <circle cx="86" cy="102" r="7" fill="#212121" />
            <circle cx="118" cy="102" r="7" fill="#212121" />
            <circle cx="82" cy="97" r="3" fill="#FFFFFF" />
            <circle cx="114" cy="97" r="3" fill="#FFFFFF" />
            <g fill="#FFFFFF" opacity="0.4">
              <rect x="65" y="130" width="70" height="4" rx="2" />
              <rect x="65" y="142" width="70" height="4" rx="2" />
              <rect x="65" y="154" width="45" height="4" rx="2" />
            </g>
          </svg>
        </div>

        {/* Texto cargando.... */}
        <div className="mt-12">
          <p className="text-xl font-medium text-muted-foreground tracking-tight">
            cargando<span className="animate-dot-1">.</span><span className="animate-dot-2">.</span><span className="animate-dot-3">.</span><span className="animate-dot-4">.</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes logo-combined {
          0% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(90deg) scale(1.1); }
          25% { transform: rotate(90deg) scale(1.1); }
          45% { transform: rotate(180deg) scale(1); }
          50% { transform: rotate(180deg) scale(1); }
          70% { transform: rotate(270deg) scale(1.1); }
          75% { transform: rotate(270deg) scale(1.1); }
          95% { transform: rotate(360deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes dot {
          0%, 20% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
        .animate-logo-combined {
          animation: logo-combined 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .animate-dot-1 { animation: dot 1.5s infinite step-start; }
        .animate-dot-2 { animation: dot 1.5s infinite step-start 0.25s; }
        .animate-dot-3 { animation: dot 1.5s infinite step-start 0.5s; }
        .animate-dot-4 { animation: dot 1.5s infinite step-start 0.75s; }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
