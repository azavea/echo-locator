import { tv } from "tailwind-variants";

export const cardStyles = tv({
    slots: {
        root: "flex flex-col align-center rounded-[var(--spacing-5)] w-full bg-white shadow-md min-w-[288px] overflow-hidden",
        image: "rounded-t-[var(--spacing-5)] h-[171px] w-full object-cover",
        closeButton:
            "absolute top-3 right-3 h-7 w-7 items-center justify-center ring-inset",
        closeIcon: "h-5 fill",
        content: "flex flex-col align-center self-stretch gap-3 py-4 px-5",
        header: "flex items-baseline gap-2",
        title: "text-md font-bold text-black",
        zip: "text-rg text-gray-500",
        tagsContainer: "flex flex-wrap gap-2",
        tag: " h-[21px] flex items-center gap-2 rounded-[var(--spacing-2)] border border-gray-300 px-2 py-1 text-xs font-bold text-[#006512]",
        statsContainer: "flex flex-start gap-5 self-stretch -mt-2",
        statItem: "flex flex-1 flex-col px-0 py-3 align-start",
        navContainer:
            "flex align-center self-stretch gap-3 border-t border-gray-300 p-3 bg-gray-100",
    },
    variants: {
        hasImage: {
            true: {
                closeButton: "bg-white",
                closeIcon: "fill-teal-800",
            },
            false: {
                closeButton: "bg-white border border-gray-300",
                closeIcon: "fill-teal-000",
            },
        },
        listView: {
            true: {
                root: "mx-4 w-auto",
            },
        },
    },
});
