import { tv } from "tailwind-variants";

export const top10TourStyles = tv({
    slots: {
        root: "absolute w-full h-full p-3 content-end z-50",
        startModalRoot: "content-end z-50",
        modalContent: "flex flex-col w-full gap-5 py-4 px-5",
        modalHeader: "text-2xl font-bold text-orange-700",
        modalSubHeader: "text-[17px] leading-[130%] font-normal text-gray-700",
        modalBodySection: "flex flex-col gap-3",
        modalBodyBox: "p-5 rounded-md bg-gray-50 items-center text-center",
        modalBodyText: "text-sm font-medium text-gray-700",
        // Start tour button styles to match map legend
        openButtonContainer: [
            "bg-white rounded-[var(--spacing-3)] p-3 pb-2 shadow-sm",
            "flex flex-col items-center gap-2 max-w-[62px] flex-wrap",
        ],
        openButtonColorBox:
            "w-[25px] h-[8px] rounded-[var(--spacing-2)] bg-[#B9C26D] border-1 border-[#748C27]",
        openButtonLabel: "text-sm text-black font-bold",
    },
    variants: {
        isOpen: {
            true: {
                root: "visible",
            },
            false: {
                root: "invisible",
            },
        },
    },
});
