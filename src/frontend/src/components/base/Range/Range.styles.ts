import { tv } from "tailwind-variants";

export const rangeStyles = tv({
    slots: {
        root: "flex flex-col gap-3 w-full",
        labelContainer: "flex flex-col",
        mainLabel: "text-sm text-gray-600",
        rangeLabel: "text-sm font-bold text-black",
        track: "absolute top-1 h-1 w-full rounded-[var(--spacing-1)] bg-gray-300",
        fill: "flex flex-col absolute h-[6px] rounded-[var(--spacing-1)] bg-gray-500",
    },
});
