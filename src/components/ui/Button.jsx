import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-islamic-green text-white hover:bg-islamic-dark focus:ring-islamic-green',
        secondary: 'bg-islamic-gold text-islamic-dark hover:bg-yellow-500 focus:ring-islamic-gold',
        outline: 'border-2 border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white focus:ring-islamic-green',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
