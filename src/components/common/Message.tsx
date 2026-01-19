interface MessageProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
    className?: string;
}

const Message = ( { message, type = 'success', onClose, className = '' }: MessageProps) => {
    const typeStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    const combinedClassName = `
        ${typeStyles[type]} 
        py-4 px-6 rounded-lg text-white w-full 
        flex items-center justify-between 
        ${className}
    `;
    
    return (
        <div className={combinedClassName.trim()}>
            <span>{message}</span>
            
            {/* 3. Tampilkan tombol close hanya jika fungsi onClose ada */}
            {onClose && (
                <button 
                onClick={onClose} 
                className="ml-4 text-white font-bold text-xl hover:opacity-75"
                aria-label="Close message"
                >
                &times; {/* Ini adalah karakter 'x' */}
                </button>
            )}
        </div>
    )
}

export default Message