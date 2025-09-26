import type { ComponentProps } from "react";
import {
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayBaseProps,
} from "react-aria-components";
import { modalOverlayStyles, modalStyles } from "./Modal.styles";

type ModalWidth = "small" | "medium" | "large";
type AriaModalBaseProps = ComponentProps<typeof AriaModal>;
interface AriaModalProps extends AriaModalBaseProps {
    size?: ModalWidth;
    overideVerticalCenter?: boolean;
}

interface AriaModalOverlayProps extends AriaModalOverlayBaseProps {
    isMobile?: boolean;
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
                isMobile: props.isMobile,
                className: props.className as string,
            })
        }
    />
);

export const Modal = (props: AriaModalProps) => (
    <AriaModal
        {...props}
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
