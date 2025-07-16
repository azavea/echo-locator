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
}

const Checkbox = ({
    isSelected,
    onChange,
    children,
    description,
    className,
    ...props
}: CustomCheckboxProps) => {
    const {
        base,
        box,
        labelContainer,
        label,
        description: descriptionStyle,
    } = checkboxStyles();

    return (
        <AriaCheckbox
            {...props}
            isSelected={isSelected}
            onChange={onChange}
            className={base({ className: className as string })}
        >
            {({ isSelected, isFocusVisible }) => (
                <>
                    <div className={box({ isSelected, isFocusVisible })}>
                        {isSelected && (
                            <CheckIcon className="font-normal h-[14px] w-[14px] fill fill-white" />
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
                    </div>
                </>
            )}
        </AriaCheckbox>
    );
};

export default Checkbox;
