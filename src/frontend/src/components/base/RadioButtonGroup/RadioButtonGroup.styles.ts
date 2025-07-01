import { tv } from "tailwind-variants";

export const radioButtonGroupStyles = tv({
    base: "flex gap-3",
});

export const radioButtonStyles = tv({
    base: [
        "flex items-center justify-center rounded-[var(--spacing-4)] border px-4 py-2 h-[34px] gap-3 self-stretch flex-1",
        "text-gray-800 text-sm font-bold transition-colors border",
        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-blue-400 focus-visible:ring-offset-2",
        "pressed:scale-[0.98]",
    ],
    variants: {
        isSelected: {
            true: "border-gray-500",
            false: "border-gray-300 hover:border-gray-500",
        },
    },
});
