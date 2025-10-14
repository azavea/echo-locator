import { Trans, useTranslation } from "react-i18next";

import StartIntro from "assets/icons/start-intro.svg?react";
import Button from "components/base/Button/Button";
import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import { top10TourStyles } from "./top10Tour.styles";

export const StartTourModal = ({
    isOpen,
    startTourCallback,
    skipTourCallback,
}: {
    isOpen: boolean;
    startTourCallback: () => void;
    skipTourCallback: () => void;
}) => {
    const {
        startModalRoot,
        modalContent,
        modalHeader,
        modalSubHeader,
        modalBodySection,
        modalBodyText,
        modalBodyBox,
    } = top10TourStyles();
    const { t } = useTranslation();
    return (
        <ModalOverlay
            isDismissable
            isMobile
            bgIsTransparent
            isOpen={isOpen}
            onOpenChange={startTourCallback}
            className={startModalRoot()}
        >
            <Modal size="large" overideVerticalCenter>
                <div className={modalContent()}>
                    <div className={modalBodySection()}>
                        <h2 className={modalHeader()}>
                            {t("top10Tour.header")}
                        </h2>
                        <p className={modalSubHeader()}>
                            {t("top10Tour.subHeader")}
                        </p>
                    </div>
                    <div className={`${modalBodySection()} ${modalBodyBox()}`}>
                        <StartIntro />
                        <p className={modalBodyText()}>
                            <Trans i18nKey="top10Tour.bodyText">
                                <strong>Edit your settings</strong> and{" "}
                                <strong>add filters</strong> using the buttons
                                at the top
                            </Trans>
                        </p>
                    </div>
                    <div className={modalBodySection()}>
                        <Button
                            onPress={startTourCallback}
                            variant="primary"
                            size="large"
                        >
                            {t("top10Tour.showMyRecommendations")}
                        </Button>
                        <Button
                            onPress={skipTourCallback}
                            variant="outline"
                            size="large"
                        >
                            {t("top10Tour.listNeighborhoods")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </ModalOverlay>
    );
};
