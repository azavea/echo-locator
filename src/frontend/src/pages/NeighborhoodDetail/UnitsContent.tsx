import { useState } from "react";
import { Link } from "react-aria-components";
import { useTranslation, Trans } from "react-i18next"; // 1. Import necessary functions

import unitsTabStyles from "./styles/unitsTab.styles.ts";
import neighborhoodDetailStyles from "./styles/NeighborhoodDetail.styles.ts";
import type {
    Neighborhood,
    NeighborhoodProperties,
} from "src/reducers/neighborhoods/types";
import CalculatorIcon from "assets/icons/calculator.svg?react";
import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import UnitsModal from "./UnitsModal.tsx";
import type { UnitSitesKeyType } from "src/enums.ts";
import { useAppSelector } from "src/store/store.ts";
import { selectUserBedroomCount } from "src/reducers/userProfile/userSlice.ts";
import getUnitsURL from "src/libs/getUnitsURLByPlatform.ts";
import formatCurrency from "src/libs/formatCurrency.ts";
import Button from "src/components/base/Button/Button.tsx";

const UnitsContent = ({
    display = true,
    isMobile,
    neighborhood,
}: {
    display: boolean;
    isMobile?: boolean;
    neighborhood: Neighborhood;
}) => {
    const { t } = useTranslation();

    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const styles = unitsTabStyles({
        isMobile: isMobile,
        display: display,
    });
    const bedroomCount = useAppSelector(selectUserBedroomCount);
    const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
    const [unitsModalLabel, setUnitsModalLabel] =
        useState<UnitSitesKeyType | null>(null);

    const {
        properties: { town, zipcode },
    } = neighborhood;

    const max_rent = neighborhood.properties[
        `max_rent_${bedroomCount}br` as keyof NeighborhoodProperties
    ] as number;

    const onUnitsLinkPress = (site: UnitSitesKeyType) => {
        setUnitsModalLabel(site);
        setIsUnitsModalOpen(true);

        const unitsLink = getUnitsURL(site, zipcode, bedroomCount, max_rent);

        window.open(unitsLink, "_blank");
    };

    return (
        <div className={styles.root()}>
            <UnitsModal
                modalOpen={isUnitsModalOpen}
                modalOpenChangeCallback={setIsUnitsModalOpen}
                isMobile={isMobile}
                unitSite={unitsModalLabel}
            />
            <div className={sharedStyles.bodySectionWrapper()}>
                <div className="flex flex-col gap-1">
                    <h4 className={styles.stepHeaderColor()}>
                        {t("neighborhoodDetail.unitsContent.step1.stepNumber")}
                    </h4>
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("neighborhoodDetail.unitsContent.step1.header")}
                    </h2>
                </div>
                <div className={styles.stepGrid()}>
                    <div className={styles.step1CardWrapper()}>
                        <div className={styles.stepCard()}>
                            <div className="flex flex-col items-start gap-3">
                                <p className={styles.stepCardBoldText()}>
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.voucherCovers"
                                    )}
                                </p>
                                <p
                                    className={sharedStyles.bodySectionTextNormal()}
                                >
                                    <span className="text-xl text-black">
                                        {formatCurrency(max_rent)}
                                    </span>{" "}
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.perMonth"
                                    )}
                                </p>
                                <br />
                                <p className={styles.stepCardBoldText()}>
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.whatYouPay"
                                    )}
                                </p>
                                <p
                                    className={sharedStyles.bodySectionTextNormal()}
                                >
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.yourPaymentDetail"
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-col gap-5">
                                <p
                                    className={sharedStyles.bodySectionTextNormal()}
                                ></p>
                            </div>
                        </div>
                        <Link
                            href="https://www.bostonhousing.org/en/Section-8-Leased-Housing/Voucher-Programs.aspx"
                            target="_blank"
                            className={`${sharedStyles.bodySectionLinkWrapper()} p-2`}
                        >
                            <p className={sharedStyles.bodySectionTextSmall()}>
                                {t(
                                    "neighborhoodDetail.unitsContent.step1.learnVouchersLink"
                                )}
                            </p>
                            <ArrowIcon
                                className={sharedStyles.bodySectionLinkArrow()}
                            />
                        </Link>
                    </div>
                    <div className={styles.step1CardWrapper()}>
                        <div className={styles.stepCard()}>
                            <div className="flex flex-col items-start gap-3">
                                <p className={styles.stepCardBoldText()}>
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.echoBenefits"
                                    )}
                                </p>
                                <div
                                    className={`${styles.stepCardTableRow()} ${styles.stepCardTableRowBorder()}`}
                                >
                                    <p
                                        className={`${styles.stepCardBoldText()} text-teal-900`}
                                    >
                                        $6,000
                                    </p>
                                    <p
                                        className={`${sharedStyles.bodySectionTextNormal()} ${styles.stepCardRowText()}`}
                                    >
                                        {t(
                                            "neighborhoodDetail.unitsContent.step1.sdBrokerFee"
                                        )}
                                    </p>
                                </div>
                                <div
                                    className={`${styles.stepCardTableRow()} ${styles.stepCardTableRowBorder()}`}
                                >
                                    <p
                                        className={`${styles.stepCardBoldText()} text-teal-900`}
                                    >
                                        $750
                                    </p>
                                    <p
                                        className={`${sharedStyles.bodySectionTextNormal()} ${styles.stepCardRowText()}`}
                                    >
                                        {t(
                                            "neighborhoodDetail.unitsContent.step1.movingExpenses"
                                        )}
                                    </p>
                                </div>
                                <div className={styles.stepCardTableRow()}>
                                    <p
                                        className={`${styles.stepCardBoldText()} text-teal-900`}
                                    >
                                        $1,500
                                    </p>
                                    <p
                                        className={`${sharedStyles.bodySectionTextNormal()} ${styles.stepCardRowText()}`}
                                    >
                                        {t(
                                            "neighborhoodDetail.unitsContent.step1.landlordIncentive"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="https://www.bostonhousing.org/en/Home.aspx"
                            target="_blank"
                            className={`${sharedStyles.bodySectionLinkWrapper()} p-2`}
                        >
                            <p className={sharedStyles.bodySectionTextSmall()}>
                                {t(
                                    "neighborhoodDetail.unitsContent.step1.learnEchoLink"
                                )}
                            </p>
                            <ArrowIcon
                                className={sharedStyles.bodySectionLinkArrow()}
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div
                className={`${sharedStyles.bodySectionWrapper()} ${sharedStyles.bodySectionWrapperBorder()}`}
            >
                <div className="flex flex-col gap-1">
                    <h4 className={styles.stepHeaderColor()}>
                        {t("neighborhoodDetail.unitsContent.step2.stepNumber")}
                    </h4>
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("neighborhoodDetail.unitsContent.step2.header")}
                    </h2>
                </div>
                <div className={sharedStyles.iconWithTextWrapper()}>
                    <CalculatorIcon className={sharedStyles.inlineIcon()} />
                    <p className="text-gray-600 text-sm self-center">
                        <Trans i18nKey="unitsContent.step2.affordabilityCalculator">
                            Use the <strong>Affordability Calculator</strong> to
                            check if a unit fits your budget
                        </Trans>
                    </p>
                </div>
                <div className={`${styles.stepGrid()}, ${styles.step2Grid()}`}>
                    <Button
                        onPress={() => onUnitsLinkPress("craigslist")}
                        variant="unstyled"
                        className={`${sharedStyles.learnMoreLinksGroup()} ${styles.step2CardWrapper()} bg-[#FBEBFF] hover:bg-[#fcf2ff]`}
                    >
                        <div
                            className={`${sharedStyles.learnMoreLink()} w-full !items-baseline hover:!bg-[#fcf2ff]`}
                        >
                            <div
                                className={sharedStyles.learnMoreLinkTextWrapper()}
                            >
                                <p
                                    className={`${styles.stepCardBoldText()} !text-[#950BB7]`}
                                >
                                    Craigslist
                                </p>
                                <p
                                    className={sharedStyles.learnMoreLinkSubText()}
                                >
                                    {t(
                                        "neighborhoodDetail.unitsContent.step2.linkSubtext",
                                        {
                                            town: town,
                                            zipcode: zipcode,
                                            brCount: bedroomCount,
                                        }
                                    )}
                                </p>
                            </div>
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </div>
                    </Button>
                    <Button
                        onPress={() => onUnitsLinkPress("zillow")}
                        variant="unstyled"
                        className={`${sharedStyles.learnMoreLinksGroup()} ${styles.step2CardWrapper()} !bg-[#DBEAFF] hover:!bg-[#ebf2fc]`}
                    >
                        <div
                            className={`${sharedStyles.learnMoreLink()} w-full !items-baseline hover:!bg-[#ebf2fc]`}
                        >
                            <div
                                className={sharedStyles.learnMoreLinkTextWrapper()}
                            >
                                <p
                                    className={`${styles.stepCardBoldText()} !text-[#0051C6]`}
                                >
                                    Zillow
                                </p>
                                <p
                                    className={sharedStyles.learnMoreLinkSubText()}
                                >
                                    {t(
                                        "neighborhoodDetail.unitsContent.step2.linkSubtext",
                                        {
                                            town: town,
                                            zipcode: zipcode,
                                            brCount: bedroomCount,
                                        }
                                    )}
                                </p>
                            </div>
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </div>
                    </Button>
                    <Button
                        onPress={() => onUnitsLinkPress("ah")}
                        variant="unstyled"
                        className={`${sharedStyles.learnMoreLinksGroup()} ${styles.step2CardWrapper()} !bg-[#E1F7FF] hover:!bg-[#e6f5fa]`}
                    >
                        <div
                            className={`${sharedStyles.learnMoreLink()} w-full !items-baseline hover:!bg-[#e6f5fa]`}
                        >
                            <div
                                className={sharedStyles.learnMoreLinkTextWrapper()}
                            >
                                <p
                                    className={`${styles.stepCardBoldText()} !text-[#005D93]`}
                                >
                                    AffordableHousing.com
                                </p>
                                <p
                                    className={sharedStyles.learnMoreLinkSubText()}
                                >
                                    {t(
                                        "neighborhoodDetail.unitsContent.step2.linkSubtext",
                                        {
                                            town: town,
                                            zipcode: zipcode,
                                            brCount: bedroomCount,
                                        }
                                    )}
                                </p>
                            </div>
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </div>
                    </Button>
                </div>
            </div>
            <div
                className={`${sharedStyles.bodySectionWrapper()} ${sharedStyles.bodySectionWrapperBorder()}`}
            >
                <div className="flex flex-col gap-1">
                    <h4 className={styles.stepHeaderColor()}>
                        {t("neighborhoodDetail.unitsContent.step3.stepNumber")}
                    </h4>
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("neighborhoodDetail.unitsContent.step3.header")}
                    </h2>
                </div>
                <p className={sharedStyles.bodySectionTextNormal()}>
                    {t("neighborhoodDetail.unitsContent.step3.bodyText")}
                </p>
                <div className={sharedStyles.learnMoreLinksGroup()}>
                    <Link
                        href="https://www.bostonhousing.org/en/Contact-Us.aspx"
                        target="_noref"
                        className={sharedStyles.learnMoreLink()}
                    >
                        {t(
                            "neighborhoodDetail.unitsContent.step3.coordinatorLink"
                        )}
                        <ArrowIcon
                            className={sharedStyles.learnMoreLinkArrow()}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnitsContent;
