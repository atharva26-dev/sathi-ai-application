import React from 'react';

interface ProgressRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 110,
  strokeWidth = 10,
  label = 'स्कोअर',
  sublabel = '/१००'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#059669'; // Green (75+)
  if (score < 50) color = '#DC2626'; // Red
  else if (score < 75) color = '#D97706'; // Amber

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Ring */}
          <circle
            stroke="#E5DCD0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Arc */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center Number Value */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            className="num-font"
            style={{ fontSize: `${size * 0.28}px`, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}
          >
            {score}
          </span>
          <span style={{ fontSize: `${size * 0.12}px`, fontWeight: 700, color: 'var(--text-muted)' }}>
            {sublabel}
          </span>
        </div>
      </div>

      {label && (
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '6px' }}>
          {label}
        </span>
      )}
    </div>
  );
};
