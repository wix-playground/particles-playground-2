export const PulseColorCycle = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff00ff" />
          <stop offset="20%" stopColor="#ff0000" />
          <stop offset="40%" stopColor="#ffff00" />
          <stop offset="60%" stopColor="#00ff00" />
          <stop offset="80%" stopColor="#0000ff" />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>

      {/* Main trajectory path */}
      <path
        d="M10,50 C15,30 20,70 25,50 C30,30 35,70 40,50 C45,30 50,70 55,50 C60,30 65,70 70,50 C75,30 80,70 85,50 C90,30 95,70 100,50"
        stroke="url(#pulseGradient)"
        strokeWidth="2"
        fill="none"
      />

      {/* Pulses - animated circles with varying sizes */}
      <g>
        <circle cx="10" cy="50" r="2" fill="#ff00ff" />
        <circle cx="25" cy="50" r="6" fill="#ff0000" />
        <circle cx="40" cy="50" r="2" fill="#ffff00" />
        <circle cx="55" cy="50" r="7" fill="#00ff00" />
        <circle cx="70" cy="50" r="3" fill="#0000ff" />
        <circle cx="85" cy="50" r="5" fill="#ff00ff" />
      </g>

      {/* Start and end point indicators */}
      <circle cx="10" cy="50" r="3" fill="#fff" stroke="#000" strokeWidth="1" />
      <circle cx="90" cy="50" r="3" fill="#000" stroke="#fff" strokeWidth="1" />
    </svg>
  );
};
