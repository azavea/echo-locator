import { tv } from "tailwind-variants";

export const yourTripsStyles = tv({
    slots: {
        root: "flex flex-col gap-5",
        heading: "text-[24px] text-gray-900 font-extrabold",
        travelModePill:
            "flex p-3 justify-center items-center rounded bg-gray-100",
        subHeading: "text-gray-600 text-xl",
        editButton: "flex",
        commuteGroupWrapper: "flex",
        commuteGroupItem: "flex w-full",
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
                commuteGroupItem: "flex w-1/2",
            },
        },
    },
});
