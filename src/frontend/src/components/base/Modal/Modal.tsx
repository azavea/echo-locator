import type { ComponentProps } from "react";
import {
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayBaseProps,
} from "react-aria-components";
import useMobileKeyboardOffset from "src/hooks/useMobileKeyboardOffset";
import { modalOverlayStyles, modalStyles } from "./Modal.styles";

export type ModalWidth = "small" | "medium" | "large";
type AriaModalBaseProps = ComponentProps<typeof AriaModal>;
interface AriaModalProps extends AriaModalBaseProps {
    size?: ModalWidth;
    overideVerticalCenter?: boolean;
}

interface AriaModalOverlayProps extends AriaModalOverlayBaseProps {
    isMobile?: boolean;
    bgIsTransparent?: boolean;
}

// TODO: the isEntering and isExiting CSS animations don't
// work properly

export const ModalOverlay = (props: AriaModalOverlayProps) => (
    <AriaModalOverlay
        {...props}
        className={({ isEntering, isExiting }) =>
            modalOverlayStyles({
                isEntering,
                isExiting,
                bgIsTransparent: props.bgIsTransparent,
                isMobile: props.isMobile,
                className: props.className as string,
            })
        }
    />
);

export const Modal = (props: AriaModalProps) => {
    const keyboardOffset = useMobileKeyboardOffset();
    return (
        <AriaModal
            {...props}
            // Overrides all vertical centering in modalStyles
            // if mobile keyboard is open to prevent overlap
            style={{
                transform: `translateY(-${keyboardOffset / 2}px)`,
            }}
            className={({ isEntering, isExiting }) =>
                modalStyles({
                    isEntering,
                    isExiting,
                    size: props.size,
                    overideVerticalCenter: props.overideVerticalCenter,
                    className: props.className as string,
                })
            }
        />
    );
};
