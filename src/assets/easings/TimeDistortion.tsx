export const TimeDistortion = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="30%" stopColor="#8844ff" />
          <stop offset="70%" stopColor="#4488ff" />
          <stop offset="100%" stopColor="#44ffff" />
        </linearGradient>

        <radialGradient id="chronoField" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Distorted spacetime grid */}
      <g stroke="#333" strokeWidth="0.5" opacity="0.3">
        <path d="M10,20 Q30,15 50,25 Q70,35 90,20" fill="none" />
        <path d="M10,40 Q30,35 50,45 Q70,55 90,40" fill="none" />
        <path d="M10,60 Q30,55 50,65 Q70,75 90,60" fill="none" />
        <path d="M10,80 Q30,75 50,85 Q70,95 90,80" fill="none" />
      </g>

      {/* Main trajectory with temporal distortions */}
      <path
        d="M10,50 Q20,30 30,50 Q40,70 50,40 Q60,20 70,60 Q80,80 90,50"
        stroke="url(#timeGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />

      {/* Time echoes - ghostly trails */}
      <g opacity="0.4">
        <path
          d="M8,52 Q18,32 28,52 Q38,72 48,42"
          stroke="#ff4444"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M6,54 Q16,34 26,54 Q36,74 46,44"
          stroke="#ff4444"
          strokeWidth="0.5"
          fill="none"
        />
      </g>

      {/* Particles with temporal effects */}
      <g>
        {/* Slow time particle (red) */}
        <circle cx="20" cy="40" r="3" fill="#ff4444" opacity="0.8" />

        {/* Time reversal particle (purple) */}
        <circle cx="35" cy="60" r="4" fill="#8844ff" opacity="0.6" />

        {/* Fast time particle (blue) */}
        <circle cx="55" cy="30" r="2" fill="#4488ff" opacity="0.9" />

        {/* Quantum fluctuation particle */}
        <circle cx="75" cy="70" r="5" fill="#44ffff" opacity="0.5" />
      </g>

      {/* Chrono field distortion */}
      <circle cx="50" cy="50" r="25" fill="url(#chronoField)" opacity="0.2" />

      {/* Start and end points */}
      <circle cx="10" cy="50" r="3" fill="#fff" stroke="#ff4444" strokeWidth="2" />
      <circle cx="90" cy="50" r="3" fill="#000" stroke="#44ffff" strokeWidth="2" />

      {/* Temporal shimmer effect */}
      <g opacity="0.6">
        <circle cx="40" cy="35" r="1" fill="#ffffff" />
        <circle cx="65" cy="55" r="1" fill="#ffffff" />
        <circle cx="25" cy="65" r="1" fill="#ffffff" />
      </g>
    </svg>
  );
};
