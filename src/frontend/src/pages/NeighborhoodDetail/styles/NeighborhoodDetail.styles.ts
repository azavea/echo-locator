import { tv } from "tailwind-variants";

const neighborhoodDetailStyles = tv({
    slots: {
        root: "flex flex-col items-start max-w-[900px] min-h-[530px] m-2 rounded-2xl bg-white shadow-2xl",
        headerMapContainer: "relative min-h-[330px] h-[330px] w-full",
        closeButton:
            "absolute top-4 right-4 z-1 size-[34px] rounded-[12px] items-center justify-center ring-inset bg-white shadow-[0_-1px_2px_0_rgba(0,0,0,0.05),0_6px_2px_0_rgba(0,0,0,0),0_4px_1px_0_rgba(0,0,0,0.01),0_2px_1px_0_rgba(0,0,0,0.05),0_1px_1px_0_rgba(0,0,0,0.09)]",
        closeIcon: "h-5",
        headerContainer:
            "flex flex-col items-center self-stretch p-4 gap-4 border-t border-b border-gray-300 bg-gray-50",
        contentContainer: "flex flex-col items-center self-stretch gap-5",
        headerContent: "flex flex-col gap-4",
        headerLabelWrapper:
            "flex flex-row w-full gap-2 align-start items-baseline",
        inlineIcon:
            "h-6 text-gray-600 text-center self-center text-2xl font-light leading-[130%]",
        headerNeighborhoodLabel:
            "overflow-hidden text-black text-ellipsis font-extrabold text-[23.04px] leading-[130%] font-mulish",
        headerZipcodeLabel:
            "overflow-hidden text-gray-500 text-ellipsis font-normal text-[19.2px] leading-[130%] font-mulish",
        headerMoveCountWrapper: "flex flex-row gap-3 p-3",
    },
    variants: {
        isMobile: {
            true: {
                root: "m-2",
                headerContainer: "p-5",
                headerContent: "flex-col",
                contentContainer: "p-5",
            },
            false: {
                root: "mx-12 my-9 h-[calc(100%-106px)]",
                headerContainer: "p-7",
                headerContent: "flex-row space-between w-full",
                headerMoveCountWrapper: "self-start",
                contentContainer: "p-7",
            },
        },
    },
});

export default neighborhoodDetailStyles;
