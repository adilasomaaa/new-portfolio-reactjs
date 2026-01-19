
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const Input = ({ label, type, name, value, onChange, placeholder, className='' }: InputProps) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>{label}</label>}
            <input
                className={`rounded py-2 px-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Input;