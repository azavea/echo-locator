import { tv } from "tailwind-variants";
import { buttonSizes } from "components/base/Button/Button.styles";

export const buttonGroupStyles = tv({
    base: "inline-flex items-center overflow-hidden rounded-[var(--spacing-4)]",
});

export const groupedButtonStyles = tv({
    base: [
        "flex h-full items-center gap-4 px-4 py-2 transition-colors",
        "font-bold text-button leading-normal capitalize",
        "cursor-pointer",
        "focus-visible:outline-none focus-visible:z-10 focus-visible:bg-orange-300",
        "pressed:scale-[0.98]",
        // Add a vertical separator
        "not-first:border-l not-first:-ml-1",
    ],
    variants: {
        variant: {
            orange: "bg-orange-200 text-orange-800 hover:bg-orange-300 not-first:border-orange-800/25",
        },
        size: {
            ...buttonSizes,
        },
    },
    defaultVariants: {
        variant: "orange",
        size: "medium",
    },
});
