import { tv } from "tailwind-variants";

export const dropdownPopoverStyles = tv({
    base: "min-w-11 overflow-auto border border-gray-300 bg-white",
});

export const dropdownItemStyles = tv({
    base: "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-teal-900 outline-none",
    variants: {
        isFocused: {
            true: "bg-teal-200",
        },
    },
});
