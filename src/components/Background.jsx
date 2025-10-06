import React, { memo } from 'react';

const Background = memo(() => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background dark:bg-background">
      <div className="absolute inset-0 bg-grid-pattern"></div>
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.04),transparent_50%)]"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1000px_at_100%_200px,hsl(var(--primary)/0.08),transparent)]"
      />
    </div>
  );
});

export default Background;