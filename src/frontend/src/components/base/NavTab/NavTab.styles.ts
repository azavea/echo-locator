import { tv } from "tailwind-variants";

export const navTabStyles = tv({
    base: [
        "relative flex items-center gap-2 px-2 h-full md:px-4 text-rg font-bold",
        "transition-colors cursor-pointer outline-none rounded-[var(--spacing-4)]",
        "focus-visible:ring-2 focus-visible:ring-muted-blue-600 focus-visible:ring-offset-2 ",
    ],
    variants: {
        isActive: {
            true: "text-teal-950 after:absolute after:top-0 after:left-0 after:w-full after:bg-teal-500 after:h-[3px] md:after:h-[4px]",
            false: "text-teal-900 hover:bg-teal-200",
        },
    },
});

export const navBadgeStyles = tv({
    base: "flex items-center justify-center h-[22px] w-min-[25px] px-3 rounded-[var(--spacing-3)]",
    variants: {
        variant: {
            primary: "border border-teal-400 text-sm font-bold text-teal-800",
            orange: "bg-orange-300 font-bold text-orange-800",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
});
