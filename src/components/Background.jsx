import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
      {/* Increased opacity and size for better visibility */}
      <div 
        className="absolute left-[-20vw] top-[5vh] h-[100vh] w-[100vw] 
                   bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent 
                   rounded-full blur-3xl opacity-70"
        style={{ transform: 'rotate(-30deg)' }}
      />
      <div 
        className="absolute right-[-25vw] bottom-[-10vh] h-[80vh] w-[80vw] 
                   bg-gradient-to-l from-blue-500/10 via-transparent to-transparent 
                   rounded-full blur-3xl opacity-70"
        style={{ transform: 'rotate(20deg)' }}
      />
      {/* Subtle grid pattern for depth */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-0 w-full h-full 
                     bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-gray-50
                     opacity-50"
        ></div>
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-50"
        ></div>
      </div>
      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default Background;