import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Logo = memo(({ className }) => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="https://mbdaqycbhdzjglaruriq.supabase.co/storage/v1/object/public/general_documents/Logo%20Fraction%20Min%20Black%20-%20copia.png" 
        alt="Fraction Finance Logo" 
        className={className}
        loading="eager"
        width="auto"
        height="48"
      />
      <span className="text-xl font-bold text-gray-800"></span>
    </Link>
  );
});

export default Logo;