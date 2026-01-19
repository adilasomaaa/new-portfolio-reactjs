import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}

const Badge = ({ children, className, ...props }: BadgeProps) => {
    return (
        <span 
            {...props}
            className={`${className ?? ''} bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-gray-300`}
        >
            {children}
        </span>
    );
};

export default Badge