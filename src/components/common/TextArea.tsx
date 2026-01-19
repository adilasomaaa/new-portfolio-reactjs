import React from 'react'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
}

const TextArea = ( { label, name, value, onChange, placeholder, className='' }: TextAreaProps) => {
  return (
    <div className="mb-4">
        {label && <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>{label}</label>}
        <textarea
            className={`rounded py-2 px-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            id={name}
            rows={4}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
  )
}

export default TextArea