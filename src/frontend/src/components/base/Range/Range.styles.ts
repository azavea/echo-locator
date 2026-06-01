import { tv } from "tailwind-variants";

export const rangeStyles = tv({
    slots: {
        root: "flex flex-col gap-3 w-full",
        labelContainer: "flex flex-col max-w-[80px]",
        mainLabel: "text-sm text-gray-600 truncate",
        rangeLabel: "text-sm font-bold text-black truncate",
        track: "absolute top-1 h-1 w-full rounded-[var(--spacing-1)] bg-gray-300",
        fill: "flex flex-row justify-end absolute h-[6px] rounded-[var(--spacing-1)] bg-gray-500",
        dots: "m-1 w-3",
    },
});
