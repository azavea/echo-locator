import { tv } from "tailwind-variants";

const compareStyles = tv({
    slots: {
        root: "flex flex-1 flex-col min-h-0 self-stretch rounded-t-[var(--spacing-5)] bg-white items-center",
        content:
            "flex flex-col items-center rounded-[var(--spacing-5)] bg-gray-50 p-7",
        title: "font-xbold text-orange-700 text-[32px] text-center leading-none",
        description: "text-[17px] text-center text-gray-700",
        imageCarouselWrapper: "flex flex-col w-full overflow-hidden",
        imageCarousel: "flex w-full relative",
    },
    variants: {
        isMobile: {
            true: {
                root: "gap-5 p-5 justify-center",
                content: "w-full gap-4",
                imageCarousel: "gap-6 flex-col overflow-y-scroll p-6",
            },
            false: {
                root: "gap-6 px-8 py-11",
                content: "w-[400px] gap-5",
                imageCarousel: "gap-7 flex-row overflow-x-scroll py-3 px-5",
            },
        },
    },
});

export default compareStyles;
