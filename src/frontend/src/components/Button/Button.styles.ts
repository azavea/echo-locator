import { tv } from "tailwind-variants";

const buttonStyles = tv({
    base: [
        // Base styles
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--spacing-4)] gap-2.5 transition-colors",
        "font-bold text-button leading-normal",
        "cursor-pointer",
        // Focus, disabled, and pressed states from react-aria-components plugin
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-blue-600 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "pressed:scale-[0.98]",
    ],
    variants: {
        variant: {
            primary: "bg-teal-800 text-white hover:bg-teal-950",
            secondary: "bg-teal-200 text-teal-800 hover:bg-teal-300",
            outline:
                "border border-gray-300 bg-transparent hover:border-gray-500",
            orange: "bg-orange-200 text-orange-800 hover:bg-orange-300",
        },
        size: {
            small: "h-[34px] px-4 py-2 text-sm gap-2",
            medium: "h-8 px-4 py-2 text-sm",
            large: "h-9 px-5 py-2 text-[17px]", // this should be text-rg, but somehow the text color will be all black
            icon: "h-[30px] w-[30px] text-[15px]",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "medium",
    },
});

export default buttonStyles;
