import { useAsyncList, type AsyncListData } from "@react-stately/data";
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

type Suggestion = { name: string; [key: string]: any };

export function Autocomplete({
    placeholder,
    suggestions,
    loadAsyncSuggestions,
    onSuggestionCallback,
    onClearCallback,
}: {
    placeholder: string;
    suggestions?: Suggestion[];
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

    let filteredSuggestions: AsyncListData<Suggestion> = useAsyncList({
        async load({ signal, filterText }) {
            if (loadAsyncSuggestions && filterText) {
                const items = await loadAsyncSuggestions(filterText, signal);
                return { items };
            } else if (suggestions && filterText) {
                const filtered = suggestions.filter(item =>
                    item.name.toLowerCase().includes(filterText.toLowerCase())
                );
                return { items: filtered };
            }
            return { items: [] };
        },
        initialFilterText: "",
    });

    // Force close menu on suggestion selection
    const menuIsOpen =
        filteredSuggestions.items.length > 1 ||
        (filteredSuggestions.items.length === 1 &&
            filteredSuggestions.filterText !==
                filteredSuggestions.items[0].name);

    return (
        <AriaAutocomplete
            onInputChange={filteredSuggestions.setFilterText}
            inputValue={filteredSuggestions.filterText}
        >
            <SearchField
                aria-label="Search"
                autoFocus
                onClear={onClearCallback}
                className={searchRoot()}
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
                items={menuIsOpen ? filteredSuggestions.items : []}
                className={`${baseDropdownPopoverStyles} ${menuIsOpen ? "visible" : "invisible"}`}
            >
                {item => (
                    <MenuItem
                        id={item.name}
                        onAction={() => {
                            filteredSuggestions.setFilterText(item.name);
                            if (onSuggestionCallback) {
                                onSuggestionCallback(item);
                            }
                        }}
                        className={baseDropdownItemStyles}
                        aria-label="item"
                    >
                        {item.name}
                    </MenuItem>
                )}
            </Menu>
        </AriaAutocomplete>
    );
}
