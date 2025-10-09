import { useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import useMediaQuery from "hooks/useMediaQuery";
import SelectLanguageButtons from "components/SelectLanguageButtons";
import Button from "components/base/Button/Button";
import { Language, type LanguageKey } from "src/enums";
import profileStyles from "./Profile.styles";

import NeighborhoodLiteImage from "assets/icons/neighborhood-lite.svg?react";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation();
    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { root, content, title, description, caption } = profileStyles({
        isMobile: !isDesktop,
    });

    console.log(isOpen);

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
                    onPress={() => setIsOpen(true)}
                >
                    {t("userProfile.actionButton")}
                </Button>
                <p className={caption()}>{t("userProfile.caption")}</p>
            </div>
            {isDesktop && (
                <SelectLanguageButtons language={lang || Language.EN} />
            )}
        </div>
    );
};

export default Profile;
