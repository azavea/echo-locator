import { tv } from "tailwind-variants";

export const sliderStyles = tv({
    slots: {
        root: "flex w-full flex-col gap-3",
        label: "text-rg font-bold text-gray-900",
        track: "relative h-[11px] w-full rounded-[var(--spacing-5)] bg-gray-200",
        fill: "absolute h-full rounded-[var(--spacing-5)] bg-gray-700",
        thumb: [
            "absolute top-1/2 h-[21px] w-[21px] rounded-full border-2 border-gray-700 bg-white",
            "focus:outline-none",
        ],
        ticksContainer: "absolute inset-0",
        tick: "absolute top-1/2 h-[5px] w-[5px] -ml-1 -translate-y-1/2 rounded-full bg-gray-400",
        endpointLabelsContainer: "flex justify-between text-sm text-gray-500",
        endpointLabel: "w-1/4 text-center",
    },
    variants: {
        isFocusVisible: {
            true: {
                thumb: "ring-2 ring-teal-700 ring-offset-2",
            },
        },
    },
});
