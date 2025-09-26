import { tv } from "tailwind-variants";

const infoTabStyles = tv({
    slots: {
        infoContentContainer: "flex flex-col items-start gap-4 self-stretch",
        infoCardGrid: "grid grid-cols-1 gap-4 w-full",
        infoCard: "flex flex-col gap-5 p-5 align-center my-0 mx-[-1em]",
        mobileCardBorder: "border-b-1 border-b-gray-300",
        cardHeaderWrapper: "flex justify-between items-start",
        cardHeader: "text-[24px] text-gray-900 font-extrabold",
        eccCheckWrapper:
            "text-[24px] text-weight-400 flex flex-row gap-2 items-center",
        aboutSection:
            "flex flex-col gap-5 w-auto self-stretch p-5 pb-0 align-center my-0 border-t-1 border-t-gray-300 relative",
        aboutText: "text-sm text-gray-700 leading-relaxed",
        readMore:
            "text-sm font-semibold text-blue-600 hover:underline cursor-pointer",
        imageCarousel: "flex flex-row gap-4 w-full overflow-x-scroll relative",
        image: "w-full h-auto rounded-lg object-cover",
        learnMoreLinksGroup: "flex flex-col gap-0 bg-gray-100 rounded-lg",
        learnMoreLink:
            "flex justify-between text-gray-800 text-[17px] px-4 py-3 items-center",
        learnMoreLinkBorder: "border-b-1 border-b-gray-300",
        learnMoreLinkArrow: "fill fill-gray-500 h-[18px]",
    },
    variants: {
        display: {
            true: {
                infoContentContainer: "visible",
            },
            false: {
                infoContentContainer: "hidden",
            },
        },
        isMobile: {
            true: {
                infoCard: "bg-white",
                mobileLineBreak: "flex",
                aboutSection: "mx-[-1em]",
            },
            false: {
                infoContentContainer: "pb-0 pt-7",
                infoCardGrid: "grid-cols-3 gap-7 py-5",
                infoCard: "bg-gray-100 rounded-lg border-b-0 mx-[0]",
                mobileCardBorder: "border-b-0 mx-[0]",
                mobileLineBreak: "hidden",
                aboutSection: "mx-[-2em] p-7 pb-0",
            },
        },
    },
});

export default infoTabStyles;
