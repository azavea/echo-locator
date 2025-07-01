import {
    RadioGroup as AriaRadioGroup,
    Radio as AriaRadio,
    type RadioGroupProps as AriaRadioGroupProps,
    type RadioProps as AriaRadioProps,
    composeRenderProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import {
    radioButtonGroupStyles,
    radioButtonStyles,
} from "./RadioButtonGroup.styles";

export interface RadioButtonProps
    extends AriaRadioProps,
        VariantProps<typeof radioButtonStyles> {
    label?: string;
}

export const RadioButtonGroup = (props: AriaRadioGroupProps) => (
    <AriaRadioGroup
        {...props}
        className={composeRenderProps(
            props.className,
            (className, renderProps) =>
                radioButtonGroupStyles({ ...renderProps, className })
        )}
    />
);

export const RadioButton = ({
    className,
    label,
    ...props
}: RadioButtonProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected }) =>
            radioButtonStyles({
                isSelected,
                className: className as string,
            })
        }
    >
        {label && <span>{label}</span>}
    </AriaRadio>
);
