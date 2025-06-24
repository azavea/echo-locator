import {
    ToggleButton as AriaToggleButton,
    ToggleButtonGroup as AriaToggleButtonGroup,
    type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
    type ToggleButtonProps as AriaToggleButtonProps,
    composeRenderProps,
} from "react-aria-components";
import { toggleGroupStyles, toggleButtonStyles } from "./ToggleButton.styles";
import { type VariantProps } from "tailwind-variants";

export interface ToggleButtonGroupProps
    extends AriaToggleButtonGroupProps,
        VariantProps<typeof toggleGroupStyles> {}

export interface ToggleButtonProps
    extends AriaToggleButtonProps,
        VariantProps<typeof toggleButtonStyles> {}

const ToggleButtonGroup = ({ className, ...props }: ToggleButtonGroupProps) => (
    <AriaToggleButtonGroup
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            toggleGroupStyles({
                ...renderProps,
                className,
            })
        )}
    />
);

const ToggleButton = ({ size, className, ...props }: ToggleButtonProps) => (
    <AriaToggleButton
        {...props}
        className={({ isSelected }) =>
            toggleButtonStyles({
                isSelected,
                size,
                className: className as string,
            })
        }
    />
);

export { ToggleButton, ToggleButtonGroup };
