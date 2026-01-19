import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
    return (
            <button
                {...props}
                className={`${className || ''} cursor-pointer hover:bg-gray-800 py-2 px-6 rounded-none transition-colors font-mono uppercase text-sm disabled:opacity-50`}
            >
                {children}
            </button>
    )
}

export default Button