import type { ComponentProps } from "react";
import {
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { modalOverlayStyles, modalStyles } from "./Modal.styles";

type AriaModalProps = ComponentProps<typeof AriaModal>;

// TODO: the isEntering and isExiting CSS animations don't
// work properly

export const ModalOverlay = (props: AriaModalOverlayProps) => (
    <AriaModalOverlay
        {...props}
        className={({ isEntering, isExiting }) =>
            modalOverlayStyles({
                isEntering,
                isExiting,
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
                className: props.className as string,
            })
        }
    />
);
