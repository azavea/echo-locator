import {
    Group as AriaGroup,
    Button as AriaButton,
    type GroupProps as AriaGroupProps,
    type ButtonProps as AriaButtonProps,
    composeRenderProps as composeButtonGroupRenderProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import { buttonGroupStyles, groupedButtonStyles } from "./ButtonGroup.styles";

export interface GroupedButtonProps
    extends AriaButtonProps,
        VariantProps<typeof groupedButtonStyles> {
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const ButtonGroup = (props: AriaGroupProps) => (
    <AriaGroup
        {...props}
        className={composeButtonGroupRenderProps(
            props.className,
            (className, renderProps) =>
                buttonGroupStyles({ ...renderProps, className })
        )}
    />
);

const GroupedButton = ({
    className,
    variant,
    size,
    label,
    leftIcon,
    rightIcon,
    ...props
}: GroupedButtonProps) => (
    <AriaButton
        {...props}
        className={composeButtonGroupRenderProps(
            className,
            (className, renderProps) =>
                groupedButtonStyles({
                    ...renderProps,
                    variant,
                    size,
                    className,
                })
        )}
    >
        {leftIcon}
        {label && <span>{label}</span>}
        {rightIcon}
    </AriaButton>
);

export { ButtonGroup, GroupedButton };
