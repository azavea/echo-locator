import { tv } from "tailwind-variants";

export const numberFieldGroupStyles = tv({
    base: "flex w-full items-center gap-3",
});

export const numberFieldInputStyles = tv({
    base: [
        "w-full h-9 rounded-[var(--spacing-4)] border border-gray-400 bg-white px-5 py-2",
        "text-center text-rg font-bold text-gray-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-blue-600 focus-visible:ring-offset-2",
        "disabled:opacity-50",
    ],
});
