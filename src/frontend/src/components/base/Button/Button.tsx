import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    composeRenderProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import buttonStyles from "./Button.styles";

export interface ButtonProps
    extends AriaButtonProps,
        VariantProps<typeof buttonStyles> {
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    info?: string;
}

const Button = ({
    className,
    variant,
    size,
    label,
    leftIcon,
    rightIcon,
    info,
    ...props
}: ButtonProps) => {
    return (
        <AriaButton
            {...props}
            className={composeRenderProps(className, (className, renderProps) =>
                buttonStyles({
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
            {info && (
                <div className="flex flex-1 justify-end">
                    <span className="text-sm font-normal text-gray-600">
                        {info}
                    </span>
                </div>
            )}
        </AriaButton>
    );
};

export default Button;
