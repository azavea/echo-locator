import { tv } from "tailwind-variants";

export const wizardStyle = tv({
    slots: {
        rootContainer: "flex flex-col p-5",
        titleContainer: "flex items-start justify-between",
        titleText: "text-[17px] font-bold text-gray-600",
        progressContainer: "flex items-center my-6",
        stepContainer: "flex flex-col gap-6 flex-grow",
        questionContainer: "flex flex-col gap-3",
        questionText: "text-2xl font-xbold text-orange-700",
        descriptionText: "text-[17px] font-normal text-gray-600",
        buttonContainer: "flex items-center justify-between mt-6 gap-3",
    },
});

export const progressDotStyle = tv({
    base: "w-[20px] h-[20px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-in-out",
    variants: {
        state: {
            completed: "bg-teal-800 border-teal-800",
            current: "bg-white border-teal-800 scale-110",
            upcoming: "bg-white border-gray-300",
        },
    },
});

export const progressLineStyle = tv({
    base: "h-1 w-full transition-colors",
    variants: {
        state: {
            completed: "bg-teal-800",
            upcoming: "bg-gray-300",
        },
    },
});
