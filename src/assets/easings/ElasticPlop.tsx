export const ElasticPlop = () => {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        {/* Gradient for energy trail */}
        <linearGradient id="energyTrail" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4ecdc4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.3" />
        </linearGradient>

        {/* Gradient for bounce barriers */}
        <linearGradient id="barrierGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff9f43" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff6348" stopOpacity="0.1" />
        </linearGradient>

        {/* Glow effect for particles */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="100" height="100" fill="#1a1a2e" />

      {/* Invisible barriers (shown as subtle lines) */}
      <line x1="30" y1="20" x2="30" y2="80" stroke="url(#barrierGrad)" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="60" x2="90" y2="60" stroke="url(#barrierGrad)" strokeWidth="1" opacity="0.4" />
      <line x1="70" y1="15" x2="70" y2="85" stroke="url(#barrierGrad)" strokeWidth="1" opacity="0.3" />

      {/* Particle trail showing bouncing path */}
      <path
        d="M 10 20 Q 25 35 30 45 Q 35 55 45 60 Q 55 65 70 55 Q 75 50 85 80"
        stroke="url(#energyTrail)"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />

      {/* Bounce impact points */}
      <circle cx="30" cy="45" r="3" fill="#ff6b6b" opacity="0.8" filter="url(#glow)">
        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>

      <circle cx="45" cy="60" r="2.5" fill="#4ecdc4" opacity="0.7" filter="url(#glow)">
        <animate attributeName="r" values="2.5;4;2.5" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
      </circle>

      <circle cx="70" cy="55" r="2" fill="#45b7d1" opacity="0.6" filter="url(#glow)">
        <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" begin="0.6s" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" begin="0.6s" />
      </circle>

      {/* Main particle showing elastic movement */}
      <circle cx="10" cy="20" r="4" fill="#feca57" filter="url(#glow)">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href="#elasticPath" />
        </animateMotion>
        <animate attributeName="r" values="4;6;3;5;4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#feca57;#ff6b6b;#4ecdc4;#45b7d1;#feca57" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Hidden path for animation */}
      <path id="elasticPath"
        d="M 10 20 Q 25 35 30 45 Q 35 55 45 60 Q 55 65 70 55 Q 75 50 85 80"
        fill="none"
        opacity="0"
      />

      {/* Target position indicator */}
      <circle cx="85" cy="80" r="6" fill="none" stroke="#54a0ff" strokeWidth="2" opacity="0.5">
        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Energy particles scattered from bounces */}
      <circle cx="32" cy="42" r="1" fill="#ff6b6b" opacity="0.6">
        <animate attributeName="cx" values="32;35;38" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="42;40;38" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>

      <circle cx="28" cy="48" r="1" fill="#4ecdc4" opacity="0.5">
        <animate attributeName="cx" values="28;25;22" dur="1.8s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="cy" values="48;50;52" dur="1.8s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" begin="0.2s" />
      </circle>

      <circle cx="47" cy="58" r="1" fill="#45b7d1" opacity="0.4">
        <animate attributeName="cx" values="47;50;53" dur="2.2s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="cy" values="58;55;52" dur="2.2s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" begin="0.4s" />
      </circle>

      {/* Speed lines showing velocity */}
      <line x1="8" y1="18" x2="5" y2="15" stroke="#feca57" strokeWidth="1" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.5s" repeatCount="indefinite" />
      </line>
      <line x1="6" y1="22" x2="3" y2="25" stroke="#feca57" strokeWidth="1" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.7s" repeatCount="indefinite" begin="0.1s" />
      </line>
    </svg>
  );
};
