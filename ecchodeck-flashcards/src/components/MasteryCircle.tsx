import React from 'react';

interface MasteryCircleProps {
  percentage: number;
  size?: number;
}

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 213.6

const MasteryCircle: React.FC<MasteryCircleProps> = ({ percentage, size = 84 }) => {
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
  const center = size / 2;

  return (
    <div className="mastery-ring" style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={RADIUS} fill="none" stroke="#1f1f1f" strokeWidth="7" />
        <circle
          cx={center} cy={center} r={RADIUS}
          fill="none" stroke="#ff5c1a" strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .9s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--txt)' }}>{Math.round(percentage)}%</span>
        <span style={{ fontSize: 9, color: 'var(--txt2)', textTransform: 'uppercase', letterSpacing: '.8px', marginTop: 1 }}>Domínio</span>
      </div>
    </div>
  );
};

export default MasteryCircle;
