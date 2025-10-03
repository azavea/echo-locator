import { tv } from "tailwind-variants";

export const accordionStyles = tv({
    slots: {
        root: "flex flex-col gap-0 bg-gray-100 border border-gray-300 rounded-lg [&_button:first-of-type]:rounded-t-lg [&_button:last-of-type]:rounded-b-lg [&_div:last-of-type]:rounded-b-lg max-h-fit",
        accordionItem: "flex w-full justify-between px-4 py-3 items-center",
        accordionItemTextWrapper:
            "flex flex-col items-start items-baseline text-gray-800 text-[17px] gap-2",
        accordionItemSubText: "text-gray-600 text-[12px]",
        accordionItemPanel: "flex flex-col w-full",
    },
    variants: {
        expanded: {
            true: {
                accordionItem: "bg-white rounded-lg border border-gray-300",
                accordionItemPanel: "bg-white",
            },
            false: {
                accordionItem: "bg-gray-100",
            },
        },
        expandedAndMobile: {
            true: {
                accordionItem: "border-0 border-t-1 border-t-gray-300",
                accordionItemPanel: "p-4",
            },
            false: {
                accordionItemPanel: "p-0",
            },
        },
        overridePanelOpen: {
            true: {
                accordionItemPanel: "h-0 p-0 invisible",
            },
            false: {
                accordionItemPanel: "flex",
            },
        },
    },
});

export default accordionStyles;
