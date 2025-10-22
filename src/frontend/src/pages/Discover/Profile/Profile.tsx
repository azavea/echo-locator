import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import Button from "components/base/Button/Button";
import SelectLanguageButtons from "components/SelectLanguageButtons";
import Wizard from "components/Wizard/Wizard";
import useMediaQuery from "hooks/useMediaQuery";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import { Language, type LanguageKey } from "src/enums";
import { useAppDispatch, type RootState } from "store/store";
import profileStyles from "./Profile.styles";
import StepBedroom from "./StepBedroom";
import StepImportance from "./StepImportance";
import StepTravelMode from "./StepTravelMode";

import NeighborhoodLiteImage from "assets/icons/neighborhood-lite.svg?react";
import StepTrips from "./StepTrips";

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
        const destinations = profileBuffer.destinations;
        // One destination must be primary, used to set
        // userProfile.activeDestination to calculate score.
        // Use first destination by default.
        if (!destinations.find(d => d.primary)) {
            destinations[0] = { ...destinations[0], primary: true };
        }
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
                <StepTrips
                    buffer={profileBuffer}
                    setProfileBuffer={setProfileBuffer}
                    handleBack={handleBack}
                    handleNext={handleFinish}
                />
            </Wizard>
        </div>
    );
};

export default Profile;
