import { tv } from "tailwind-variants";

export const textFieldStyles = tv({
    base: "flex w-full flex-col",
});

export const inputStyles = tv({
    base: [
        "w-full rounded-lg border border-gray-400 bg-white text-gray-800 transition-colors",
        "placeholder:text-gray-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-blue-600 focus-visible:ring-offset-2",
        "disabled:opacity-50",
    ],
    variants: {
        inputSize: {
            small: "",
            medium: "h-8 px-4 py-2 text-[17px]",
            large: "h-9 px-5 py-2 text-[17px]",
        },
    },
    defaultVariants: {
        inputSize: "medium",
    },
});
