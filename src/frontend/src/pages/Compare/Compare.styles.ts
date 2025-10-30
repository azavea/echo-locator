import { tv } from "tailwind-variants";

const compareStyles = tv({
    slots: {
        root: "flex flex-1 flex-col min-h-0 self-stretch rounded-t-[var(--spacing-5)] bg-white items-center",
        content:
            "flex flex-col items-center rounded-[var(--spacing-5)] bg-gray-50 p-7",
        title: "font-xbold text-orange-700 text-[32px] text-center",
        description: "text-[17px] text-center text-gray-700",
        imageCarousel: "flex flex-row w-full overflow-x-scroll relative py-3",
    },
    variants: {
        isMobile: {
            true: {
                root: "gap-5 p-5 justify-center",
                content: "w-full gap-4",
                imageCarousel: "gap-6",
            },
            false: {
                root: "gap-6 px-8 py-11",
                content: "w-[400px] gap-5",
                imageCarousel: "gap-7",
            },
        },
    },
});

export default compareStyles;
