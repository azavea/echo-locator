import React from "react";
import { Dialog } from "react-aria-components";

import {
    Modal,
    ModalOverlay,
    type ModalWidth,
} from "components/base/Modal/Modal";
import WizardProgress from "./WizardProgress";
import { wizardStyle } from "./Wizard.styles";

interface WizardProps {
    currentStep: number;
    isOpen: boolean;
    title: string;
    totalSteps: number;
    showProgress?: boolean;
    size?: ModalWidth;
    isMobile?: boolean;
    handleClose: () => void;
    children: React.ReactNode;
}

const Wizard = ({
    currentStep,
    isOpen,
    title,
    totalSteps,
    showProgress = true,
    size = "small",
    isMobile = true,
    handleClose,
    children,
}: WizardProps) => {
    const stepContents = React.Children.toArray(children);

    const { rootContainer, titleContainer, titleText } = wizardStyle();

    return (
        isOpen && (
            <ModalOverlay
                isDismissable
                isMobile={isMobile}
                isOpen={isOpen}
                onOpenChange={handleClose}
            >
                <Modal size={size}>
                    <Dialog aria-label={title}>
                        <div className={rootContainer()}>
                            {/* Header */}
                            <div className={titleContainer()}>
                                <h2 className={titleText()}>{title}</h2>
                            </div>

                            {/* Progress tracker */}
                            {showProgress && (
                                <WizardProgress
                                    totalSteps={totalSteps}
                                    currentStep={currentStep}
                                />
                            )}

                            {/* Step Content */}
                            {stepContents[currentStep - 1]}
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        )
    );
};

export default Wizard;
