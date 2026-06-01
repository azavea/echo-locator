import { tv } from "tailwind-variants";

const loginInStyles = tv({
    slots: {
        root: "flex flex-1 flex-col min-h-0 self-stretch rounded-t-[var(--spacing-5)] bg-white gap-6 items-center",
        content: "flex w-[324px] flex-col items-center justify-end",
        captionContainer: "flex w-full flex-col gap-3 text-center",
        caption: "font-xbold text-orange-700",
        modalContainer: "flex flex-1 flex-col items-start gap-5 p-5",
        modalTitle: "font-xbold text-xl text-orange-700",
        modalErrorText: "text-orange-600",
        mailImageContainer: "flex flex-col self-stretch items-center",
    },
    variants: {
        isMobile: {
            true: {
                root: "p-6 justify-center",
                content: "gap-4",
                caption: "text-xl",
            },
            false: {
                root: "p-8",
                content: "gap-6 pt-8",
                caption: "text-3xl",
                modalContainer: " max-w-[450px]",
            },
        },
    },
});

export default loginInStyles;
