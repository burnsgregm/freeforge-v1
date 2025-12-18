import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors",
    {
        variants: {
            variant: {
                default: "bg-navy-700 text-white",
                critical: "bg-status-critical text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]",
                high: "bg-status-high text-white",
                medium: "bg-status-medium text-white",
                low: "bg-status-low text-white",
                success: "bg-status-success text-white",
                outline: "border border-navy-700 text-slate-400 bg-transparent",
            },
            size: {
                sm: "text-[10px] px-2 py-0.5",
                md: "text-xs px-3 py-1",
                lg: "text-sm px-4 py-1.5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        }
    }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <span className={badgeVariants({ variant, size, className })} {...props} />
    );
}
