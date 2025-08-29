import { tv } from "tailwind-variants";

const discoverStyles = tv({
    slots: {
        root: "flex flex-1 min-h-0 self-stretch rounded-t-[var(--spacing-5)] bg-white",
        sidebar:
            "flex w-[360px] rounded-tl-[var(--spacing-5)] flex-col overflow-hidden border-r-1 border-gray-300",
        headerContainer: "flex border-b border-gray-300 bg-white",
        recoContainer:
            "flex flex-1 flex-col items-start gap-6 self-stretch overflow-y-auto bg-gray-50",
        subTitleContainer: "flex w-full flex-col gap-3 text-center",
        subTitle: "font-xbold text-3xl text-orange-700",
        description: "text-rg text-gray-700",
        recoList: "flex w-full flex-col gap-6",
        recoTitleContainer: "flex flex-row items-center gap-[10px]",
        recoTitle: "font-xbold text-2xl text-black",
        recoDescription: "text-rg text-gray-600",
        swatch: "w-[16px] h-[16px] rounded-[var(--spacing-2)] border border-[#748C27] bg-[#BCD168]",
    },
    variants: {
        isMobile: {
            true: {
                root: "flex-col",
                headerContainer: "p-3",
                recoContainer: "p-5",
            },
            false: {
                root: "flex-row",
                headerContainer: "p-6",
                recoContainer: "p-6",
            },
        },
        mobileListDisplay: {
            false: {
                recoContainer: "hidden",
            },
        },
    },
});

export default discoverStyles;
