import { tv } from "tailwind-variants";

export const checkboxStyles = tv({
    slots: {
        base: "flex items-start gap-3",
        box: "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[var(--spacing-3)] border-2 transition",
        labelContainer: "flex flex-col gap-1",
        label: "text-rg font-bold text-gray-900",
        description: "text-sm text-gray-600",
    },
    variants: {
        isSelected: {
            true: {
                box: "border-teal-600 bg-teal-600",
            },
            false: {
                box: "border-gray-400 bg-white",
            },
        },
        isFocusVisible: {
            true: {
                box: "ring-2 ring-teal-600 ring-offset-2",
            },
        },
    },
});
