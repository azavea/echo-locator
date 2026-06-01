import {
    Checkbox as AriaCheckbox,
    Text,
    type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";

import { checkboxStyles } from "./Checkbox.styles";

import CheckIcon from "assets/icons/check.svg?react";

interface CustomCheckboxProps extends AriaCheckboxProps {
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "small" | "default";
    variant?: "ghost" | "default";
}

const Checkbox = ({
    isSelected,
    onChange,
    children,
    description,
    className,
    isDisabled,
    footer,
    size,
    variant,
    ...props
}: CustomCheckboxProps) => {
    const {
        base,
        box,
        labelContainer,
        label,
        description: descriptionStyle,
        footer: footerStyles,
    } = checkboxStyles({ isDisabled });

    return (
        <AriaCheckbox
            {...props}
            isSelected={isSelected}
            onChange={!isDisabled ? onChange : () => {}}
            className={base({ className: className as string })}
        >
            {({ isSelected, isFocusVisible }) => (
                <>
                    <div
                        className={box({
                            isSelected: isSelected,
                            isFocusVisible: isFocusVisible,
                            variant: variant,
                            size: size,
                        })}
                    >
                        {isSelected && (
                            <CheckIcon
                                className={`font-normal h-[14px] w-[14px] fill ${variant === "ghost" ? "fill-gray-600" : "fill-white"}`}
                            />
                        )}
                    </div>
                    <div className={labelContainer()}>
                        <span className={label()}>{children}</span>
                        {description && (
                            <Text
                                slot="description"
                                className={descriptionStyle()}
                            >
                                {description}
                            </Text>
                        )}

                        {footer && (
                            <span className={footerStyles()}>{footer}</span>
                        )}
                    </div>
                </>
            )}
        </AriaCheckbox>
    );
};

export default Checkbox;
