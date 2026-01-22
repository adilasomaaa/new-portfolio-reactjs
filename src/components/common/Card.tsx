import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-paper p-6 border border-black ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;