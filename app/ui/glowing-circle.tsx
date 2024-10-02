export default function GlowingCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="absolute -right-2 -top-1 h-4 w-4"
    >
      <defs>
        <radialGradient
          id="redGlow"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop
            offset="0%"
            style={{ stopColor: "rgb(255,0,0)", stopOpacity: 1 }}
          />
          <stop
            offset="70%"
            style={{ stopColor: "rgb(255,0,0)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "rgb(255,100,100)", stopOpacity: 0 }}
          />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#redGlow)">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
