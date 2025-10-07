import { tv } from "tailwind-variants";

const unitsTabStyles = tv({
    slots: {
        root: "flex flex-col items-start gap-4 self-stretch",
        stepGrid: "flex w-full",
        step2Grid: "",
        step1CardWrapper: "flex flex-col gap-2",
        step2CardWrapper: "p-2 gap-1",
        stepCard: "flex flex-col gap-5 p-5 bg-gray-100 align-center rounded-lg",
        stepHeaderColor: "font-bold text-orange-800",
        stepCardBoldText: "text-[17px] font-bold text-gray-900",
        stepCardTableRow: "grid grid-cols-3 gap-3 w-full py-3",
        stepCardRowText: "text-gray-900 col-span-2",
        stepCardTableRowBorder: "border-b-1 border-b-gray-300",
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
                stepGrid: "flex-col gap-6",
                step2Grid: "gap-3",
                step1CardWrapper: "w-full",
                step2CardWrapper: "w-full",
            },
            false: {
                root: "pb-0 pt-7",
                stepGrid: "flex-row gap-7 py-5",
                step2Grid: "gap-7 pb-5",
                step1CardWrapper: "w-1/2",
                step2CardWrapper: "w-1/3",
            },
        },
    },
});

export default unitsTabStyles;
