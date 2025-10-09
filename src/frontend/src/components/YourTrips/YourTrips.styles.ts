import { tv } from "tailwind-variants";

export const yourTripsStyles = tv({
    slots: {
        root: "flex flex-col gap-5 py-4",
        heading: "text-[24px] text-gray-900 font-extrabold",
        travelModePill:
            "flex px-3 justify-center items-center rounded bg-gray-100 text-sm text-gray-900",
        subHeading: "text-gray-600 text-xl",
        editButton: "flex",
        commuteGroupWrapper: "flex",
        commuteGroupItem: "flex w-full",
        loadingWrapper: "flex w-full flex-col flex-grow-1 justify-center",
        loadingSpinner:
            "w-10 h-10 border-6 border-[#02B3CC] border-t-transparent rounded-full animate-spin self-center",
        directionsLink:
            "inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white shadow-md text-gray-700 font-[Mulish] text-sm font-bold",
    },
    variants: {
        isMobile: {
            true: {
                root: "",
                editButton: "w-full",
                commuteGroupWrapper: "flex-col",
                commuteGroupItem: "flex w-full",
            },
            false: {
                root: "",
                editButton: "w-fit flex-start",
                commuteGroupWrapper: "flex-row justify-between gap-7",
                commuteGroupItem: "flex !w-1/2",
            },
        },
    },
});
