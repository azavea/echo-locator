import { tv } from "tailwind-variants";

export const accordionStyles = tv({
    slots: {
        root: "flex flex-col gap-0 border border-gray-300 rounded-lg max-h-fit overflow-clip bg-gray-100",
        accordionItemWrapper:
            "group border-b-1 border-gray-300 [:has(+[data-expanded='true'])]:border-transparent data-[expanded=true]:border-transparent data-[expanded=true]:z-2 last:border-0",
        accordionItem:
            "flex flex-col w-full justify-between items-center bg-gray-100",
        accordionItemHeading: "w-full",
        accordionButton: "flex w-full px-4 py-3 justify-between gap-4",
        accordionItemTextWrapper:
            "flex flex-col items-start items-baseline text-gray-800 text-base gap-0",
        accordionItemSubText: "text-gray-600 text-xs text-left",
        accordionItemPanel: "flex flex-col w-full",
    },
    variants: {
        expanded: {
            true: {
                accordionItem: "bg-white outline outline-gray-300 rounded-lg",
            },
            false: {
                accordionItem: "z-1",
            },
        },
        expandedAndMobile: {
            true: {
                accordionItem: "bg-white outline outline-gray-300 rounded-lg",
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
