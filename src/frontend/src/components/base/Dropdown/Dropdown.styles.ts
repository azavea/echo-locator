import { tv } from "tailwind-variants";

export const dropdownPopoverStyles = tv({
    base: "min-w-11 overflow-auto bg-white shadow-md rounded-[var(--spacing-3)] p-2",
});

export const dropdownItemStyles = tv({
    base: "flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-teal-900 outline-none rounded-[var(--spacing-2)]",
    variants: {
        isFocused: {
            true: "bg-teal-200",
        },
    },
});
