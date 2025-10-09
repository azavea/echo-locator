import { tv } from "tailwind-variants";

const profileStyles = tv({
    slots: {
        root: "flex flex-1 flex-col min-h-0 self-stretch rounded-t-[var(--spacing-5)] bg-white items-center",
        content: "flex flex-col items-center rounded-[var(--spacing-5)]",
        title: "font-xbold text-orange-700 text-[32px] text-center",
        description: "text-[17px] text-center text-gray-700",
        caption: "text-[14px] text-center text-gray-600",
    },
    variants: {
        isMobile: {
            true: {
                root: "gap-5 p-5 justify-center",
                content: "gap-4",
            },
            false: {
                root: "gap-6 px-8 py-11",
                content: "w-[400px] bg-gray-50 gap-5 p-7",
            },
        },
    },
});

export default profileStyles;
