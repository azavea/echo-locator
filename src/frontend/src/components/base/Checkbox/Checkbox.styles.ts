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
                box: "border-teal-700 bg-teal-700",
            },
            false: {
                box: "border-gray-400 bg-white",
            },
        },
        isFocusVisible: {
            true: {
                box: "ring-2 ring-teal-700 ring-offset-2",
            },
        },
        isDisabled: {
            true: {
                box: "border-gray-300 bg-gray-300 hover:cursor-not-allowed",
                label: "text-gray-500 hover:cursor-not-allowed",
                description: "text-gray-400 hover:cursor-not-allowed",
            },
        },
    },
});
