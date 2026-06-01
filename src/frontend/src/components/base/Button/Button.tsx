import {
    Button as AriaButton,
    type ButtonProps as AriaButtonProps,
    composeRenderProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import type { Ref } from "react";
import buttonStyles from "./Button.styles";

export interface ButtonProps
    extends AriaButtonProps,
        VariantProps<typeof buttonStyles> {
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    info?: string;
    ref?: Ref<HTMLButtonElement> | null;
    children?: React.ReactNode;
}

const Button = ({
    className,
    variant,
    size,
    children,
    leftIcon,
    rightIcon,
    info,
    ref,
    ...props
}: ButtonProps) => {
    return (
        <AriaButton
            {...props}
            ref={ref}
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
            {children}
            {rightIcon}
            {info && (
                <div className="flex flex-1 justify-end overflow-hidden">
                    <span
                        className="text-sm font-normal text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis
"
                    >
                        {info}
                    </span>
                </div>
            )}
        </AriaButton>
    );
};

export default Button;
