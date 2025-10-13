import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import NeighborhoodLiteImage from "assets/icons/neighborhood-lite.svg?react";
import Button from "components/base/Button/Button";
import EditWizard from "components/EditWizard/EditWizard";
import StepBedroom from "components/EditWizard/StepBedroom";
import StepImportance from "components/EditWizard/StepImportance";
import StepTravelMode from "components/EditWizard/StepTravelMode";
import StepTrips from "components/EditWizard/StepTrips";
import SelectLanguageButtons from "components/SelectLanguageButtons";
import useMediaQuery from "hooks/useMediaQuery";
import { Language, type LanguageKey } from "src/enums";
import profileStyles from "./Profile.styles";

const Profile = () => {
    const [isWizardOpen, setWizardOpen] = useState(false);

    const { t } = useTranslation();
    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { root, content, title, description, caption } = profileStyles({
        isMobile: !isDesktop,
    });

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
            <EditWizard
                isWizardOpen={isWizardOpen}
                setWizardOpen={setWizardOpen}
            >
                <StepBedroom />
                <StepImportance />
                <StepTravelMode />
                <StepTrips />
            </EditWizard>
        </div>
    );
};

export default Profile;
