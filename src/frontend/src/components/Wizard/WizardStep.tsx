import Button from "../base/Button/Button";
import { wizardStyle } from "./Wizard.styles";

import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";

interface WizardStep {
    question: string;
    description?: string;
    buttonText?: string;
    disableBack?: boolean;
    children: React.ReactNode;
    handleBack: () => void;
    handleNext: () => void;
}

const WizardStep = ({
    question,
    description = undefined,
    buttonText = "Continue",
    disableBack = false,
    handleBack,
    handleNext,
    children,
}: WizardStep) => {
    const {
        stepContainer,
        questionContainer,
        questionText,
        descriptionText,
        buttonContainer,
    } = wizardStyle();

    return (
        <div className={stepContainer()}>
            <div className={questionContainer()}>
                <h3 className={questionText()}>{question}</h3>
                {!!description && (
                    <p className={descriptionText()}>{description}</p>
                )}
            </div>
            {children}
            <div className={buttonContainer()}>
                <Button
                    variant="outline"
                    size="large"
                    isDisabled={disableBack}
                    leftIcon={
                         <ArrowLeftIcon className={`font-normal h-[14px] w-[14px] ${disableBack ? "fill-gray-300" : "text-black"}`} />
                    }
                    onPress={handleBack}
                />
                <Button
                    variant="primary"
                    size="large"
                    className="w-full"
                    onPress={handleNext}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default WizardStep;
