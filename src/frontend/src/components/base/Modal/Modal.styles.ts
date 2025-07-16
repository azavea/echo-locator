import { tv } from "tailwind-variants";

export const modalOverlayStyles = tv({
    base: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
    variants: {
        isEntering: {
            true: "animate-in fade-in",
        },
        isExiting: {
            true: "animate-out fade-out",
        },
    },
});

export const modalStyles = tv({
    base: [
        "fixed top-1/2 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--spacing-4)]",
        "bg-white shadow-md",
    ],
    variants: {
        isEntering: {
            true: "animate-in zoom-in-95 fade-in",
        },
        isExiting: {
            true: "animate-out zoom-out-95 fade-out",
        },
    },
});
