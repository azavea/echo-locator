import { tv } from "tailwind-variants";

const mapStyles = tv({
    slots: {
        mapContainer: "flex flex-1 items-center justify-center",
        legendContainer: [
            "absolute bg-white rounded-[var(--spacing-3)] p-3 shadow-lg",
            "flex items-center justify-center gap-4",
        ],
        legendItem: "flex items-center gap-2",
        legendColorBox: "w-4 h-4 rounded-[var(--spacing-2)]",
        legendLabel: "text-sm text-black font-bold",
    },
    variants: {
        isMobile: {
            true: {
                legendContainer: "bottom-9",
            },
            false: {
                legendContainer: "top-10 right-4",
            },
        },
    },
});

export default mapStyles;
