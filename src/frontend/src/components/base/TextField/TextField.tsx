import {
    TextField as AriaTextField,
    Input as AriaInput,
    type TextFieldProps as AriaTextFieldProps,
    type InputProps as AriaInputProps,
    composeRenderProps,
} from "react-aria-components";

import { textFieldStyles, inputStyles } from "./TextField.styles";
import type { VariantProps } from "tailwind-variants";

export interface TextInputProps
    extends AriaInputProps,
        VariantProps<typeof inputStyles> {
    inputSize: "medium" | "large";
}

const TextField = (props: AriaTextFieldProps) => (
    <AriaTextField
        {...props}
        className={textFieldStyles({ className: props.className as string })}
    />
);

const TextInput = ({ className, inputSize, ...props }: TextInputProps) => (
    <AriaInput
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            inputStyles({
                ...renderProps,
                inputSize,
                className,
            })
        )}
    />
);

export { TextField, TextInput };
