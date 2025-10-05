
import React, { memo } from 'react';

const Background = memo(() => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background dark:bg-background">
      <div className="absolute inset-0 bg-grid-pattern"></div>
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05),transparent_40%)]"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(var(--primary-rgb),0.1),transparent)]"
      />
    </div>
  );
});

export default Background;
