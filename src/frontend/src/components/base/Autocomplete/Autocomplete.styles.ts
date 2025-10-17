import { tv } from "tailwind-variants";

const autocompleteStyles = tv({
    slots: {
        searchRoot:
            "flex w-full border border-gray-300 rounded-lg max-h-fit focus-within:border-teal-600 focus-within:border-2 cursor-pointer hover:border-gray-500",
        input: "p-4 overflow-clip w-full justify-between text-md font-normal text-gray-800 placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden focus:outline-none",
    },
});

export default autocompleteStyles;
