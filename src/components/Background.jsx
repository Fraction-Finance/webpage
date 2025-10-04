import React, { memo } from 'react';

const Background = memo(() => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <div 
        className="absolute left-[-20vw] top-[5vh] h-[100vh] w-[100vw] 
                   bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-transparent 
                   rounded-full blur-3xl opacity-80 animate-pulse"
        style={{ animationDuration: '10s', transform: 'rotate(-30deg)' }}
      />
      <div 
        className="absolute right-[-25vw] bottom-[-10vh] h-[80vh] w-[80vw] 
                   bg-gradient-to-l from-blue-500/5 via-transparent to-transparent 
                   rounded-full blur-3xl opacity-80 animate-pulse"
        style={{ animationDuration: '12s', animationDelay: '2s', transform: 'rotate(20deg)' }}
      />
    </div>
  );
});

export default Background;