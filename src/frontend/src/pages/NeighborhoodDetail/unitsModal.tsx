import { Link } from "react-aria-components";
import { useTranslation, Trans } from "react-i18next"; // Import useTranslation and Trans

import { ModalOverlay, Modal } from "components/base/Modal/Modal";
import neighborhoodDetailStyles from "./styles/NeighborhoodDetail.styles";
import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import { unitSiteLabel, type UnitSitesKeyType } from "src/enums";

const UNITS_TEXT_COLOR = {
    craigslist: "#950BB7",
    zillow: "#0051C6",
    ah: "#005D93",
};

const UnitsModal = ({
    modalOpen,
    modalOpenChangeCallback,
    unitSite,
    isMobile,
}: {
    modalOpen: boolean;
    modalOpenChangeCallback: (b: boolean) => void;
    unitSite: UnitSitesKeyType | null;
    isMobile?: boolean;
}) => {
    const { t } = useTranslation();
    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });

    return (
        unitSite && (
            <ModalOverlay
                isDismissable
                isMobile
                isOpen={modalOpen}
                onOpenChange={modalOpenChangeCallback}
            >
                <Modal size="small" className="flex flex-col gap-6 p-5">
                    <h1 className="text-xl font-extrabold">
                        <span
                            className={`!text-[${UNITS_TEXT_COLOR[unitSite]}]`}
                        >
                            {unitSiteLabel[unitSite]}{" "}
                        </span>
                        {t("neighborhoodDetail.unitsContent.unitsModal.header")}
                    </h1>
                    <div className="flex flex-col gap-3 w-full">
                        <div className={sharedStyles.learnMoreLinksGroup()}>
                            <Link
                                href="https://www.bostonhousing.org/en/Public-Housing/Paying-Rent/How-Rent-is-Set.aspx"
                                target="_noref"
                                className={`${sharedStyles.learnMoreLink()} gap-4`}
                            >
                                <div
                                    className={sharedStyles.learnMoreLinkTextWrapper()}
                                >
                                    <strong>
                                        {t(
                                            "neighborhoodDetail.unitsContent.unitsModal.affordLinkTitle"
                                        )}
                                    </strong>
                                    <p
                                        className={sharedStyles.learnMoreLinkSubText()}
                                    >
                                        {t(
                                            "neighborhoodDetail.unitsContent.unitsModal.affordLinkSubtitle"
                                        )}
                                    </p>
                                </div>
                                <ArrowIcon
                                    className={sharedStyles.learnMoreLinkArrow()}
                                />
                            </Link>
                        </div>
                        <div className={sharedStyles.learnMoreLinksGroup()}>
                            <Link
                                href="https://www.bostonhousing.org/en/Section-8-Leased-Housing/How-Rent-is-Set/Can-I-afford-this-apartment-Use-our-new-Rent-Esti.aspx"
                                target="_noref"
                                className={`${sharedStyles.learnMoreLink()} gap-4`}
                            >
                                <div
                                    className={sharedStyles.learnMoreLinkTextWrapper()}
                                >
                                    <strong>
                                        {t(
                                            "neighborhoodDetail.unitsContent.unitsModal.calculatorLinkTitle"
                                        )}
                                    </strong>
                                    <p
                                        className={sharedStyles.learnMoreLinkSubText()}
                                    >
                                        <Trans i18nKey="neighborhoodDetail.unitsContent.unitsModal.calculatorLinkSubtitle">
                                            The{" "}
                                            <strong>
                                                BHA Affordability Calculator
                                            </strong>{" "}
                                            helps you estimate your copay.
                                        </Trans>
                                    </p>
                                </div>
                                <ArrowIcon
                                    className={sharedStyles.learnMoreLinkArrow()}
                                />
                            </Link>
                        </div>
                    </div>
                </Modal>
            </ModalOverlay>
        )
    );
};

export default UnitsModal;
