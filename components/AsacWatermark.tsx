import React from 'react';

export const AsacWatermark = () => {
  
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full flex-wrap items-center justify-center gap-2">
        {Array.from({ length: 56 }).map((_, i) => (
          <img
            key={i}
            src="/assets/logo_asac.png"
            alt="ASAC Logo"
            className="h-20 w-20 opacity-10 dark:brightness-0 dark:invert"
            style={{
              transform: `rotate(-30deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
};