import {
    Children,
    cloneElement,
    isValidElement,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Wizard from "components/Wizard/Wizard";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import { useAppDispatch, type RootState } from "store/store";

import type { BaseProps } from "../Discover/Profile/types";

type EditWizardChildComponent<P = {}> = React.ReactElement<P & BaseProps>;

interface EditWizardProps {
    isWizardOpen: boolean;
    setWizardOpen: (isOpen: boolean) => void;
    children: ReactNode;
}

const EditWizard = ({
    isWizardOpen,
    setWizardOpen,
    children,
}: EditWizardProps) => {
    const profile = useSelector((state: RootState) => state.userProfile);
    const [profileBuffer, setProfileBuffer] = useState({ ...profile });
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = Children.count(children);

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    // listen to profile change in redux store and update local buffer
    useEffect(() => {
        setProfileBuffer({ ...profile });
    }, [profile]);

    const handleClose = () => {
        // clear buffers and states
        setProfileBuffer({ ...profile });
        setWizardOpen(false);
        // Reset to first step when the modal is closed
        setTimeout(() => setCurrentStep(1), 200);
    };

    // next button callback, only for navigation
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // previous button callback, only for navigation
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // persist data to backend via PUT endpoint
    // redux store's user profile gets updated on fulfilled PUT in the reducer
    const handleFinish = () => {
        // TODO: May need to take care of destinations from your trips wizard
        dispatch(
            updateUserProfile({
                ...profileBuffer,
                voucherRooms: profileBuffer.rooms,
                importanceAccessibility: parseInt(
                    profileBuffer.importanceAccessibility
                ),
                importanceSchools: parseInt(profileBuffer.importanceSchools),
                importanceViolentCrime: parseInt(
                    profileBuffer.importanceViolentCrime
                ),
            })
        );
        handleClose();
    };

    const childrenWithStepProps = Children.map(children, (child, index) => {
        // We only clone valid elements (not strings, numbers, null, etc.)
        if (isValidElement(child)) {
            // Clone the element and merge the new props
            return cloneElement(child as EditWizardChildComponent, {
                buffer: profileBuffer,
                setProfileBuffer: setProfileBuffer,
                handleBack: handleBack,
                handleNext:
                    index === totalSteps - 1 ? handleFinish : handleNext,
            });
        }

        // Return non-elements as they are
        return child;
    });

    return (
        <Wizard
            title={t(
                currentStep < 4
                    ? "userProfile.wizard.header"
                    : "userTrip.wizard.header"
            )}
            currentStep={currentStep}
            isOpen={isWizardOpen}
            totalSteps={totalSteps}
            handleClose={handleClose}
        >
            {childrenWithStepProps}
        </Wizard>
    );
};

export default EditWizard;
