import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { Language, type LanguageKey } from "src/enums";
import { useAppDispatch, type RootState } from "store/store";
import useMediaQuery from "hooks/useMediaQuery";
import SelectLanguageButtons from "components/SelectLanguageButtons";
import Button from "components/base/Button/Button";
import Wizard from "components/Wizard/Wizard";
import WizardStep from "components/Wizard/WizardStep";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import StepBedroom from "./StepBedroom";
import StepImportance from "./StepImportance";
import StepTravelMode from "./StepTravelMode";
import profileStyles from "./Profile.styles";

import NeighborhoodLiteImage from "assets/icons/neighborhood-lite.svg?react";

const TOTAL_STEPS = 4;

const Profile = () => {
    const profile = useSelector((state: RootState) => state.userProfile);
    const [profileBuffer, setProfileBuffer] = useState({ ...profile });
    const [isWizardOpen, setWizardOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { root, content, title, description, caption } = profileStyles({
        isMobile: !isDesktop,
    });

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
        if (currentStep < TOTAL_STEPS) {
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

    return (
        <div className={root()}>
            {!isDesktop && (
                <SelectLanguageButtons language={lang || Language.EN} />
            )}
            <p className={title()}>{t("userProfile.title")}</p>
            <div className={content()}>
                <NeighborhoodLiteImage />
                <p className={description()}>{t("userProfile.description")}</p>
                <Button
                    variant="primary"
                    size="large"
                    className={isDesktop ? "" : "w-full"}
                    onPress={() => setWizardOpen(true)}
                >
                    {t("userProfile.actionButton")}
                </Button>
                <p className={caption()}>{t("userProfile.caption")}</p>
            </div>
            {isDesktop && (
                <SelectLanguageButtons language={lang || Language.EN} />
            )}
            <Wizard
                title={t(
                    currentStep < 4
                        ? "userProfile.wizard.header"
                        : "userTrip.wizard.header"
                )}
                currentStep={currentStep}
                isOpen={isWizardOpen}
                totalSteps={TOTAL_STEPS}
                handleClose={handleClose}
            >
                <StepBedroom
                    buffer={profileBuffer}
                    setProfileBuffer={setProfileBuffer}
                    handleBack={handleBack}
                    handleNext={handleNext}
                />
                <StepImportance
                    buffer={profileBuffer}
                    setProfileBuffer={setProfileBuffer}
                    handleBack={handleBack}
                    handleNext={handleNext}
                />
                <StepTravelMode
                    buffer={profileBuffer}
                    setProfileBuffer={setProfileBuffer}
                    handleBack={handleBack}
                    handleNext={handleNext}
                />
                {/* TODO: Your trip steps */}
                <WizardStep
                    question={t("userTrip.wizard.stepAddTrip.question")}
                    description={t("userTrip.wizard.stepAddTrip.description")}
                    buttonText={t("userTrip.wizard.button.finish")}
                    handleBack={handleBack}
                    handleNext={handleFinish}
                >
                    <p className=" text-gray-600">
                        Step 4. The "Add trip" logic goes here
                    </p>
                </WizardStep>
            </Wizard>
        </div>
    );
};

export default Profile;
