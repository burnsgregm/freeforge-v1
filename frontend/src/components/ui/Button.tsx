import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
    {
        variants: {
            variant: {
                primary: "bg-secondary-600 text-white hover:bg-secondary-500 shadow-lg shadow-secondary-900/20",
                secondary: "border border-navy-700 bg-transparent text-slate-300 hover:bg-navy-800",
                danger: "bg-status-critical text-white hover:bg-red-700",
                ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-navy-800",
                icon: "p-2 bg-transparent text-slate-400 hover:bg-navy-800 hover:text-white rounded-md",
            },
            size: {
                sm: "px-3 py-1.5 text-xs",
                md: "px-4 py-2",
                lg: "px-6 py-3 text-base",
                icon: "h-9 w-9 p-0",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
        }
    }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, size, fullWidth, className })}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
