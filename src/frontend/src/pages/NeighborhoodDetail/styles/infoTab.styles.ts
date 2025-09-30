import { tv } from "tailwind-variants";

const infoTabStyles = tv({
    slots: {
        root: "flex flex-col items-start gap-4 self-stretch",
        infoCardGrid: "grid grid-cols-1 gap-4 w-full",
        infoCard: "flex flex-col gap-5 p-5 align-center flex-wrap",
        mobileOnlyCardBorder: "border-b-1 border-b-gray-300",
        eccCheckWrapper:
            "text-[24px] text-weight-400 flex flex-row gap-2 items-center",
        imageCarousel: "flex flex-row gap-4 w-full overflow-x-scroll relative",
        image: "w-full h-auto rounded-lg object-cover",
    },
    variants: {
        display: {
            true: {
                root: "visible",
            },
            false: {
                root: "hidden",
            },
        },
        isMobile: {
            true: {
                infoCard: "bg-white",
            },
            false: {
                root: "pb-0 pt-7",
                infoCardGrid: "grid-cols-3 gap-7 py-5",
                infoCard: "bg-gray-100 rounded-lg border-b-0",
                mobileOnlyCardBorder: "border-b-0",
            },
        },
    },
});

export default infoTabStyles;
