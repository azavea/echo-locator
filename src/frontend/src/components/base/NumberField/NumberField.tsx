import {
    composeRenderProps,
    NumberField as AriaNumberField,
    Input as AriaNumberInput,
    type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";
import {
    numberFieldGroupStyles,
    numberFieldInputStyles,
} from "./NumberField.styles";

const NumberField = ({ children, ...props }: AriaNumberFieldProps) => (
    <AriaNumberField
        {...props}
        className={numberFieldGroupStyles({
            className: props.className as string,
        })}
    >
        {children}
    </AriaNumberField>
);

const NumberInput = ({
    className,
    ...props
}: React.ComponentProps<typeof AriaNumberInput>) => (
    <AriaNumberInput
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            numberFieldInputStyles({
                ...renderProps,
                className,
            })
        )}
    />
);

export { NumberField, NumberInput };
