import { tv } from "tailwind-variants";

const mapStyles = tv({
    slots: {
        mapContainer: "flex flex-1 items-center justify-center relative",
        legendWrapper: "absolute flex justify-center m-4",
        legendContainer: [
            "bg-white rounded-[var(--spacing-3)] p-3 py-[3px] shadow-sm",
            "flex items-center gap-4",
        ],
        legendItem: "flex items-center gap-2",
        legendColorBox: "w-5 h-5 rounded-[var(--spacing-2)]",
        legendLabel: "text-sm text-black font-bold",
    },
    variants: {
        isMobile: {
            true: {
                legendWrapper: "bottom-7 left-0 right-0",
            },
            false: {
                legendWrapper: "top-0 right-0",
            },
        },
        mapDisplay: {
            false: {
                mapContainer: "hidden",
            },
        },
    },
});

export default mapStyles;
