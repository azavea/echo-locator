import {
    Menu as AriaMenu,
    MenuItem as AriaMenuItem,
    MenuTrigger as AriaMenuTrigger,
    type MenuProps as AriaMenuProps,
    type MenuItemProps as AriaMenuItemProps,
    type MenuTriggerProps as AriaMenuTriggerProps,
    Popover as AriaPopover,
} from "react-aria-components";

import { dropdownItemStyles, dropdownPopoverStyles } from "./Dropdown.styles";

const DropdownTrigger = (props: AriaMenuTriggerProps) => (
    <AriaMenuTrigger {...props} />
);

const Dropdown = <T extends object>(props: AriaMenuProps<T>) => (
    <AriaPopover className={dropdownPopoverStyles()}>
        <AriaMenu {...props} />
    </AriaPopover>
);

const DropdownItem = (props: AriaMenuItemProps) => (
    <AriaMenuItem
        {...props}
        className={({ isFocused }) =>
            dropdownItemStyles({
                isFocused,
                className: props.className as string,
            })
        }
    />
);

export { Dropdown, DropdownItem, DropdownTrigger };
