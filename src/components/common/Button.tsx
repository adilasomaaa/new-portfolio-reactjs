import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
    return (
            <button
                {...props}
                className={`${className || ''} cursor-pointer bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg transition-colors `}
            >
                {children}
            </button>
    )
}

export default Button