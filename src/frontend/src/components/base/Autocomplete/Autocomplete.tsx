import { useAsyncList, type AsyncListData } from "@react-stately/data";
import type { Point } from "geojson";
import { useEffect } from "react";
import {
    Autocomplete as AriaAutocomplete,
    Input,
    Menu,
    MenuItem,
    SearchField,
} from "react-aria-components";

import TimesIcon from "assets/icons/times.svg?react";
import Button from "components/base/Button/Button";
import {
    dropdownItemStyles,
    dropdownPopoverStyles,
} from "../Dropdown/Dropdown.styles";
import autocompleteStyles from "./Autocomplete.styles";

export type Suggestion = {
    name: string;
    geometry?: Point;
    [key: string]: any;
};

export function Autocomplete({
    placeholder,
    suggestions,
    value,
    loadAsyncSuggestions,
    onSuggestionCallback,
    onClearCallback,
}: {
    placeholder: string;
    suggestions?: Suggestion[];
    value?: string;
    loadAsyncSuggestions?: (
        query: string,
        signal: AbortSignal
    ) => Promise<Suggestion[]>;
    onSuggestionCallback?: (suggestion: Suggestion) => void;
    onClearCallback?: () => void;
}) {
    const { searchRoot, input: inputStyles } = autocompleteStyles();
    const baseDropdownPopoverStyles = dropdownPopoverStyles();
    const baseDropdownItemStyles = dropdownItemStyles();

    // Avoids using react-aria filter prop to handle suggesting async data or static data
    // Expanded from example of useAsyncList from react-aria Autocomplete docs:
    // https://react-spectrum.adobe.com/react-aria/Autocomplete.html#async-loading
    // If loadAsyncSuggestions passed in, handles load fn that returns promise of filtered data from server.
    // If not async, handles filtering of static list manually.
    let filteredSuggestions: AsyncListData<Suggestion> = useAsyncList({
        async load({ signal, filterText }) {
            if (loadAsyncSuggestions && filterText) {
                const items = await loadAsyncSuggestions(filterText, signal);
                return { items };
            } else if (suggestions && filterText) {
                const filtered = suggestions
                    .filter(item =>
                        item.name
                            .toLowerCase()
                            .includes(filterText.toLowerCase())
                    )
                    .slice(0, 5);
                return { items: filtered };
            }
            return { items: [] };
        },
        initialFilterText: value ?? "",
    });

    // Force close menu on suggestion selection
    const isMenuOpen =
        filteredSuggestions.items.length &&
        !filteredSuggestions.items.find(
            i => i.name === filteredSuggestions.filterText
        );

    useEffect(() => {
        if (filteredSuggestions.filterText === "" && value && onClearCallback)
            onClearCallback();
    }, [filteredSuggestions.filterText]);

    return (
        <AriaAutocomplete
            onInputChange={filteredSuggestions.setFilterText}
            inputValue={filteredSuggestions.filterText}
        >
            <SearchField
                aria-label="Search"
                autoFocus
                onClear={onClearCallback}
                className={`${searchRoot()} ${isMenuOpen ? "rounded-b-none" : ""} `}
            >
                <Input placeholder={placeholder} className={inputStyles()} />
                <Button
                    variant="outline"
                    size="small"
                    leftIcon={
                        <TimesIcon className="h-5 w-5 font-ligth fill-black" />
                    }
                    className="h-7 w-7 py-2 px-3 self-center mr-3"
                />
            </SearchField>
            <Menu
                items={isMenuOpen ? filteredSuggestions.items : []}
                className={`${baseDropdownPopoverStyles} ${isMenuOpen ? "visible" : "!invisible"} rounded-t-none`}
            >
                {item => {
                    const distinctItem =
                        item.full_address ?? item.address ?? item.name;
                    return (
                        <MenuItem
                            id={distinctItem}
                            onAction={() => {
                                filteredSuggestions.setFilterText(distinctItem);
                                if (onSuggestionCallback) {
                                    onSuggestionCallback(item);
                                }
                            }}
                            className={baseDropdownItemStyles}
                            aria-label="item"
                        >
                            {distinctItem}
                        </MenuItem>
                    );
                }}
            </Menu>
        </AriaAutocomplete>
    );
}
