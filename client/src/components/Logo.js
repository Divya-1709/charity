import React from 'react';

export default function Logo({ size = 36, showText = false, textStyle = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        height: size,
        width: Math.round(size * 1.55),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: Math.round(size * 0.28),
        padding: '3px 6px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <img
          src="/logo-transparent.png"
          alt="HopeBridge Logo"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
          onError={(e) => {
            // fallback to original if transparent wasn't cached yet
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>
      {showText && (
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: Math.max(16, Math.round(size * 0.55)),
          background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          ...textStyle
        }}>
          HopeBridge
        </span>
      )}
    </div>
  );
}
