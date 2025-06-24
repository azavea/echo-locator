import { tv } from "tailwind-variants";

export const toggleGroupStyles = tv({
    base: "inline-flex items-center justify-center rounded-[var(--spacing-4)] border border-gray-300 bg-gray-100",
});

export const toggleButtonStyles = tv({
    base: "flex items-center justify-center text-md font-semibold transition-colors outline-none cursor-pointer gap-2.5 rounded-[var(--spacing-4)] px-[10px] py-3",
    variants: {
        isSelected: {
            true: "bg-white text-gray-900 shadow-sm",
            false: "bg-transparent text-gray-600 hover:text-gray-900 border-none",
        },
        size: {
            small: "h-[34px] px-[10px] py-3 text-sm",
            medium: "h-8 px-4 py-3 text-sm",
            large: "h-9 px-4 py-5 text-[17px]", // this should be text-rg, but somehow the text color will be all black
        },
    },
});
