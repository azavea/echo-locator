import {
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayProps,
    type ModalOverlayProps as AriaModalProps,
    composeRenderProps,
} from "react-aria-components";
import { modalOverlayStyles, modalStyles } from "./Modal.styles";

export const ModalOverlay = ({
    className,
    ...props
}: AriaModalOverlayProps) => (
    <AriaModalOverlay
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            modalOverlayStyles({
                ...renderProps,
                className,
            })
        )}
    />
);

export const Modal = ({ className, ...props }: AriaModalProps) => (
    <AriaModal
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            modalStyles({
                ...renderProps,
                className,
            })
        )}
    />
);
