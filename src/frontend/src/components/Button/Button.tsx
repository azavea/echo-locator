import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    composeRenderProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import buttonStyles from "./Button.styles";

export interface ButtonProps
    extends AriaButtonProps,
        VariantProps<typeof buttonStyles> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
    return (
        <AriaButton
            {...props}
            // composeRenderProps is a utility from React Aria Components
            // merging a user's className with component-specific classes.
            // This correctly handles all types and states.
            className={composeRenderProps(className, () =>
                buttonStyles({
                    variant,
                    size,
                })
            )}
        />
    );
};

export default Button;
