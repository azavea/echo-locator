import { tv } from "tailwind-variants";

export const modalOverlayStyles = tv({
    base: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-3",
    variants: {
        isEntering: {
            true: "animate-in fade-in duration-300 ease-out",
        },
        isExiting: {
            true: "animate-out fade-out duration-200 ease-in",
        },
        isMobile: {
            true: "p-3",
            false: "p-9",
        },
        bgIsTransparent: {
            true: "bg-transparent backdrop-blur-none",
        },
    },
});

export const modalStyles = tv({
    base: [
        "relative z-50 w-full justify-self-center mx-auto rounded-[var(--spacing-4)] max-h-full overflow-y-scroll",
        "bg-white shadow-md",
    ],
    variants: {
        isEntering: {
            true: "animate-in zoom-in-95 ease-out duration-300",
        },
        isExiting: {
            true: "animate-out zoom-out-95 ease-in duration-200",
        },
        size: {
            small: "w-[95%] max-w-md",
            medium: "w-full max-w-[450px]",
            large: "w-full max-w-[900px]",
        },
        overideVerticalCenter: {
            true: "justify-start max-h-full overflow-y-scroll",
            false: "top-1/2 -translate-y-1/2",
        },
    },
});
