import {
    RadioGroup as AriaRadioGroup,
    Radio as AriaRadio,
    type RadioGroupProps as AriaRadioGroupProps,
    type RadioProps as AriaRadioProps,
    composeRenderProps,
} from "react-aria-components";

import {
    radioButtonGroupStyles,
    radioButtonStyles,
} from "./RadioButtonGroup.styles";

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

export const RadioButton = ({ className, ...props }: AriaRadioProps) => (
    <AriaRadio
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            radioButtonStyles({
                ...renderProps,
                className,
            })
        )}
    />
);
