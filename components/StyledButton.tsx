import React from 'react';

interface StyledButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
}) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 cursor-pointer';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-6 py-2 text-base',
        large: 'px-8 py-3 text-lg',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const className = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles}`;

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default StyledButton;
