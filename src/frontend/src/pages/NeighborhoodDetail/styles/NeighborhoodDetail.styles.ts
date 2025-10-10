import { tv } from "tailwind-variants";

const neighborhoodDetailStyles = tv({
    slots: {
        root: "flex flex-col items-start max-w-[900px] min-h-[530px] m-2 rounded-2xl bg-white shadow-2xl",
        headerMapContainer: "relative min-h-[330px] h-[330px] w-full",
        headerContainer:
            "flex flex-col self-stretch items-start p-4 gap-3 border-t border-b border-gray-300 bg-gray-50",
        contentContainer: "flex flex-col items-center self-stretch gap-5",
        headerContent: "flex flex-col gap-3 w-full",
        headerLabelWrapper:
            "flex flex-row w-full gap-2 align-start items-baseline",
        inlineIcon:
            "h-6 text-gray-600 text-center self-center text-2xl font-light leading-[130%] shrink-0",
        headerNeighborhoodLabel:
            "overflow-hidden text-black text-ellipsis font-extrabold text-2xl leading-[130%] font-mulish",
        headerZipcodeLabel:
            "overflow-hidden text-gray-500 text-ellipsis font-normal text-lg leading-[130%] font-mulish",
        iconWithTextWrapper: "flex flex-row gap-3 p-3",
        toggleGroup: "w-full max-w-[350px]",
        bodySectionWrapper:
            "flex flex-col gap-5 w-auto self-stretch p-5 align-center my-0 relative flex-wrap py-7",
        bodySectionWrapperBorder: "border-t-1 border-t-gray-300",
        bodySectionHeading:
            "text-[24px] text-gray-900 font-extrabold leading-tight",
        bodySectionTextSmall: "text-sm text-gray-700 leading-relaxed",
        bodySectionTextNormal: "text-[17px] text-gray-700 leading",
        bodySectionLinkWrapper: "flex flex-row flex-start gap-3 items-center",
        bodySectionLinkArrow: "fill text-gray-400 h-[10px]",
        learnMoreLinksGroup: "flex flex-col gap-0 bg-gray-100 rounded-lg",
        learnMoreLink:
            "flex justify-between px-4 py-3 items-center cursor-pointer hover:opacity-70 hover:rounded-lg",
        learnMoreLinkTextWrapper:
            "flex flex-col text-gray-800 text-[17px] gap-1 items-start",
        learnMoreLinkSubText: "text-black/60 text-[12px]",
        learnMoreLinkBorder: "border-b-1 border-b-gray-300",
        learnMoreLinkArrow: "fill text-black/50 h-[14px]",
    },
    variants: {
        isMobile: {
            true: {
                root: "m-2",
                headerContainer: "p-5",
                headerContent: "flex-col",
                toggleGroup: "p-5 pb-0",
                contentContainer: "p-0",
                bodySectionWrapperBorder: "mx-0",
            },
            false: {
                root: "mx-12 my-9 h-[calc(100%-106px)]",
                headerContainer: "p-7",
                headerContent: "flex-row space-between w-full items-center",
                iconWithTextWrapper: "self-start",
                toggleGroup: "p-0",
                contentContainer: "p-7",
                bodySectionWrapper: "p-0",
                bodySectionWrapperBorder: "mx-[-2em] p-7 pb-0",
            },
        },
    },
});

export default neighborhoodDetailStyles;
