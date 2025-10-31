import { useAsyncList, type AsyncListData } from "@react-stately/data";
import type { Point } from "geojson";
import { useEffect, useRef, useState } from "react";
import {
    ComboBox as AriaCombobox,
    Input,
    ListBox,
    ListBoxItem,
    SearchField,
} from "react-aria-components";

import SearchIcon from "assets/icons/search.svg?react";
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
    allowFuzzySearch = false,
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
    allowFuzzySearch?: boolean;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const clearButtonRef = useRef<HTMLButtonElement>(null);

    // Handles filter text set from other parent search,
    // to keep the map search and list search values in sync
    useEffect(() => {
        filteredSuggestions.setFilterText(value ?? "");
    }, [value]);

    const handleTextSearch = () => {
        if (filteredSuggestions.filterText) {
            const search = allowFuzzySearch
                ? { name: filteredSuggestions.filterText }
                : filteredSuggestions.items[0];
            !allowFuzzySearch && filteredSuggestions.setFilterText(search.name);
            onSuggestionCallback && onSuggestionCallback(search);
        }
    };

    const handleSelection = (selection: Suggestion) => {
        setIsMenuOpen(false);
        filteredSuggestions.setFilterText(selection.name);
        onSuggestionCallback && onSuggestionCallback(selection);
    };

    const handleClear = () => {
        filteredSuggestions.setFilterText("");
        onClearCallback && onClearCallback();
    };

    return (
        <div className="w-full">
            <AriaCombobox
                onInputChange={filteredSuggestions.setFilterText}
                inputValue={filteredSuggestions.filterText}
                allowsCustomValue
                aria-label="Search"
                onOpenChange={isOpen => setIsMenuOpen(isOpen)}
                onBlur={handleTextSearch}
            >
                <SearchField
                    aria-label="Search Input"
                    autoFocus
                    onSubmit={handleTextSearch}
                    className={`${searchRoot()} ${isMenuOpen ? "rounded-b-none" : ""} `}
                >
                    <SearchIcon className="w-[30px] fill fill-gray-500 self-center shrink-0 pl-4" />
                    <Input
                        placeholder={placeholder}
                        className={inputStyles()}
                        ref={inputRef}
                    />
                    {filteredSuggestions.filterText && (
                        <Button
                            variant="outline"
                            size="small"
                            ref={clearButtonRef}
                            leftIcon={
                                <TimesIcon className="h-5 w-5 font-ligth fill-black" />
                            }
                            className="h-7 w-7 py-2 px-3 self-center mr-3"
                            aria-label="Clear search"
                            onPress={handleClear}
                        />
                    )}
                </SearchField>
                <ListBox
                    ref={listRef}
                    aria-label="Search suggestions"
                    items={filteredSuggestions.items}
                    className={`${baseDropdownPopoverStyles} ${isMenuOpen ? "!block" : "hidden"} w-full rounded-t-none`}
                >
                    {item => {
                        const distinctItem =
                            item.full_address ?? item.address ?? item.name;
                        return (
                            <ListBoxItem
                                id={distinctItem}
                                onAction={() => handleSelection(item)}
                                className={baseDropdownItemStyles}
                                aria-label="item"
                            >
                                {distinctItem}
                            </ListBoxItem>
                        );
                    }}
                </ListBox>
            </AriaCombobox>
        </div>
    );
}
