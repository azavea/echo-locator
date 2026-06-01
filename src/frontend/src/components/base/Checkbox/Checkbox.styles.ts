import { tv } from "tailwind-variants";

export const checkboxStyles = tv({
    slots: {
        base: "flex items-start gap-3",
        box: "flex flex-shrink-0 items-center justify-center rounded-[var(--spacing-3)] transition",
        labelContainer: "flex flex-col gap-1",
        label: "text-rg font-bold text-gray-900",
        description: "text-sm text-gray-600",
        footer: "text-sm text-gray-600 flex flex-row gap-2 items-center mt-2",
    },
    variants: {
        isSelected: {
            true: {},
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
        variant: {
            default: {},
            ghost: {},
        },
        size: {
            default: {
                box: "h-6 w-6 border-2",
            },
            small: {
                box: "h-[22px] w-[22px] border-1",
            },
        },
    },
    compoundVariants: [
        {
            isSelected: true,
            variant: "default",
            class: {
                box: "border-teal-700 bg-teal-700 text-white",
            },
        },
        {
            isSelected: true,
            variant: "ghost",
            class: {
                box: "bg-white border-gray-400 text-gray-600",
            },
        },
    ],
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
