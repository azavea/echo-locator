import React from "react";
import type { VariantProps } from "tailwind-variants";

import {
    progressDotStyle,
    progressLineStyle,
    wizardStyle,
} from "./Wizard.styles";

interface WizardProgressProps {
    totalSteps: number;
    currentStep: number;
}

const getProgressInfo = (index: number, currentStep: number) => {
    const step = index + 1;
    const isCompleted = step < currentStep;
    const isCurrent = step === currentStep;

    let state: VariantProps<typeof progressDotStyle>["state"] = "upcoming";
    if (isCompleted) state = "completed";
    if (isCurrent) state = "current";
    return { step, isCompleted, state };
};

const WizardProgress = ({ totalSteps, currentStep }: WizardProgressProps) => {
    const { progressContainer } = wizardStyle();

    return (
        <div className={progressContainer()}>
            {Array.from({ length: totalSteps }).map((_, index) => {
                const { step, isCompleted, state } = getProgressInfo(
                    index,
                    currentStep
                );
                return (
                    <React.Fragment key={step}>
                       <div className={progressDotStyle({ state })}>
                            {isCompleted && (
                                <CheckIcon className="w-[10px] h-[10px] fill-white" />
                            )}
                        </div>
                        {step < totalSteps && (
                            <div
                                className={progressLineStyle({
                                    state: isCompleted
                                        ? "completed"
                                        : "upcoming",
                                })}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default WizardProgress;
