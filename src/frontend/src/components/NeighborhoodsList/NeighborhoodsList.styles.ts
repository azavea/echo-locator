import { tv } from "tailwind-variants";

export const listStyles = tv({
    slots: {
        root: "flex flex-col",
        listContainer: "flex flex-col gap-7",
        groupContainer: "inline-flex gap-3",
        groupTitle: "text-md font-bold text-black",
        groupCount: "text-rg text-gray-500",
        button: "h-8",
    },
    variants: {
        isMobile: {
            true: {
                root: "pb-5",
                button: "mx-5 w-auto",
                groupContainer: "mx-5 mb-5",
            },
            false: {
                root: "pb-6",
                button: "mx-6",
                groupContainer: "mx-6 mb-6",
            },
        },
        isGroup: {
            true: {
                root: "bg-#F3F4F6 rounded-[16px] border-2 border-gray-400 bg-gray-100 mx-3 py-5",
            },
        },
    },
});
