import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`${className} bg-white rounded-lg p-6 border border-gray-200 `}>
      {children}
    </div>
  );
};

export default Card;