import { tv } from "tailwind-variants";

export const navTabStyles = tv({
    base: "relative flex items-center gap-2 p-2 md:px-4 md:py-2 text-rg font-bold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
    variants: {
        isActive: {
            true: "text-teal-950 border-t-3 md:border-t-4 border-solid border-t-teal-500",
            false: "text-teal-900 pt-3 md:pt-3",
        },
    },
});

export const navBadgeStyles = tv({
    base: "flex items-center justify-center h-[22px] md:h-[25px] w-[25px] py-2.5 px-3 rounded-[var(--spacing-3)]",
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
