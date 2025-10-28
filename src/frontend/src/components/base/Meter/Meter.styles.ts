import { tv } from "tailwind-variants";

export const meterStyles = tv({
    slots: {
        root: "flex flex-col gap-3 w-full ",
        labelContainer: "flex flex-col",
        mainLabel: "text-sm text-gray-600",
        valueLabel: "text-sm font-bold text-black -mt-1 mb-[1px] text-nowrap",
        track: "absolute top-1 h-1 w-full rounded-[var(--spacing-1)] bg-gray-300",
        fill: "absolute h-[6px] rounded-[var(--spacing-1)]",
        thumb: "absolute rounded-[var(--spacing-1)] top-[3px] h-4 w-2 -translate-y-1/2 left-[calc(50%-2px)] bg-gray-500 border border-white",
    },
    variants: {
        status: {
            Low: { fill: "bg-low" },
            "Below Avg": { fill: "bg-below-avg" },
            Average: { fill: "bg-avg" },
            "Above Avg": { fill: "bg-above-avg" },
            High: { fill: "bg-high" },
        },
    },
});
