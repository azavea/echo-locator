import { tv } from "tailwind-variants";

export const toggleGroupStyles = tv({
    base: "inline-flex items-center justify-center rounded-[var(--spacing-4)] border border-gray-300 bg-gray-100 overflow-hidden",
});

export const toggleButtonStyles = tv({
    base: "flex items-center justify-center text-md outline-0 outline-gray-300 font-semibold transition-colors cursor-pointer gap-2.5 rounded-[var(--spacing-4)] px-[10px] py-3 focus-visible:ring-2 ring-teal-700 focus-visible:ring-2 ring-inset ring-offset-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    variants: {
        isSelected: {
            true: "bg-white text-gray-900 shadow-sm outline-1 rounded-[11px]",
            false: "bg-transparent text-gray-600 hover:text-gray-900 border-none outline-0",
        },
        size: {
            small: "h-[34px] px-[10px] py-3 text-sm",
            medium: "h-8 px-4 py-3 text-sm",
            large: "h-9 px-4 py-5 text-[17px]", // this should be text-rg, but somehow the text color will be all black
        },
    },
});
