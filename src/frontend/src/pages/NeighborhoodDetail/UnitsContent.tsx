import { Link } from "react-aria-components";
import { Trans, useTranslation } from "react-i18next";

import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import CalculatorIcon from "assets/icons/calculator.svg?react";
import Button from "components/base/Button/Button.tsx";
import formatCurrency from "libs/formatCurrency.ts";
import { getUnitsURL } from "libs/getLinkURLs.ts";
import type {
    Neighborhood,
    NeighborhoodProperties,
} from "reducers/neighborhoods/types";
import { selectUserBedroomCount } from "reducers/userProfile/userSlice.ts";
import {
    AFFORDABILITY_CALCULATOR_URL,
    BHA_URL,
    BHA_VOUCHER_URL,
} from "src/constants.ts";
import type { UnitSitesKeyType } from "src/enums.ts";
import { useAppSelector } from "store/store.ts";
import neighborhoodDetailStyles from "./styles/NeighborhoodDetail.styles.ts";
import unitsTabStyles from "./styles/unitsTab.styles.ts";

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

    const {
        properties: { town, zipcode, ecc },
    } = neighborhood;

    const max_rent = neighborhood.properties[
        `max_rent_${bedroomCount}br` as keyof NeighborhoodProperties
    ] as number;

    const onUnitsLinkPress = (site: UnitSitesKeyType) => {
        const unitsLink = getUnitsURL(site, zipcode, bedroomCount, max_rent);
        window.open(unitsLink, "_blank");
    };

    return (
        <div className={styles.root()}>
            {/* step 1 */}
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
                    <div className={styles.step1CardWrapper({ isEcc: ecc })}>
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
                            href={BHA_VOUCHER_URL}
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
                    {ecc && (
                        <div
                            className={styles.step1CardWrapper({ isEcc: ecc })}
                        >
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
                                            $$$$$
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
                                href={BHA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${sharedStyles.bodySectionLinkWrapper()} p-2`}
                            >
                                <p
                                    className={sharedStyles.bodySectionTextSmall()}
                                >
                                    {t(
                                        "neighborhoodDetail.unitsContent.step1.learnEchoLink"
                                    )}
                                </p>
                                <ArrowIcon
                                    className={sharedStyles.bodySectionLinkArrow()}
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* step 2 */}
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
                        <Trans
                            i18nKey="neighborhoodDetail.unitsContent.step2.affordabilityCalculator"
                            components={{
                                calcLink: (
                                    <a
                                        href={AFFORDABILITY_CALCULATOR_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold underline"
                                    />
                                ),
                            }}
                        />
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
            {/* step 3 */}
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
                        href={AFFORDABILITY_CALCULATOR_URL}
                        target="_noref"
                        className={sharedStyles.learnMoreLink()}
                    >
                        <span className="flex flex-row gap-3">
                            <CalculatorIcon
                                className={sharedStyles.inlineIcon()}
                            />
                            {t(
                                "neighborhoodDetail.unitsContent.step3.linkSubtext"
                            )}
                        </span>
                        <ArrowIcon
                            className={sharedStyles.learnMoreLinkArrow()}
                        />
                    </Link>
                </div>
            </div>
            {/* step 4 */}
            <div
                className={`${sharedStyles.bodySectionWrapper()} ${sharedStyles.bodySectionWrapperBorder()}`}
            >
                <div className="flex flex-col gap-1">
                    <h4 className={styles.stepHeaderColor()}>
                        {t("neighborhoodDetail.unitsContent.step4.stepNumber")}
                    </h4>
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("neighborhoodDetail.unitsContent.step4.header")}
                    </h2>
                </div>
                <p className={sharedStyles.bodySectionTextNormal()}>
                    {t("neighborhoodDetail.unitsContent.step4.bodyText")}
                </p>
                <div className={sharedStyles.learnMoreLinksGroup()}>
                    <Link
                        href="mailto:ECHO@bostonhousing.org"
                        target="_top"
                        className={sharedStyles.learnMoreLink()}
                    >
                        {t(
                            "neighborhoodDetail.unitsContent.step4.coordinatorLink"
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
