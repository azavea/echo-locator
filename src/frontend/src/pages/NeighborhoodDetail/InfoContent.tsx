import { useEffect, useState } from "react";
import { Button, Link } from "react-aria-components";
import { Trans, useTranslation } from "react-i18next";

import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import CircleCheckIcon from "assets/icons/circle-check.svg?react";
import Meter from "components/base/Meter/Meter";
import { LicensedImage } from "components/CCLicensedImage";
import YourTrips from "components/YourTrips/YourTrips";
import type {
    Neighborhood,
    NeighborhoodProperties,
} from "reducers/neighborhoods/types";
import SchoolMeter from "src/components/SchoolMeter";
import { isNeighborhoodBostonTownArea } from "src/libs/formatNeighborhoodDataByCard";
import infoTabStyles from "./styles/infoTab.styles";
import neighborhoodDetailStyles from "./styles/NeighborhoodDetail.styles";

const NEIGHBORHOOD_IMG_TYPES = [
    "street",
    "open_space_or_landmark",
    "school",
    "town_square",
];

const InfoContent = ({
    display = true,
    isMobile,
    neighborhood,
    unitsLinkCallback,
}: {
    display: boolean;
    isMobile?: boolean;
    neighborhood: Neighborhood;
    unitsLinkCallback: () => void;
}) => {
    const { t } = useTranslation();
    const DESC_MAX_LENGTH = isMobile ? 125 : 225;
    const [isDisplayingShortenedDesc, setIsDisplayingShortenedDesc] =
        useState(true);
    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const styles = infoTabStyles({
        isMobile: isMobile,
        display: display,
    });

    const {
        properties: {
            ecc,
            zipcode,
            crime_percentile,
            education_percentile,
            school_choice,
            town_area,
            town_website_description,
            town_link,
            wikipedia_link,
        },
    } = neighborhood;

    useEffect(() => {
        setIsDisplayingShortenedDesc(
            town_website_description.length > DESC_MAX_LENGTH
        );
    }, [town_website_description]);

    const FindUnitsLink = () => (
        <Link
            onPress={unitsLinkCallback}
            className={sharedStyles.bodySectionLinkWrapper()}
        >
            <p className={sharedStyles.bodySectionTextSmall()}>
                <Trans i18nKey="neighborhoodDetail.findUnitsLink">
                    Go to <strong>Find Units</strong> to learn more
                </Trans>
            </p>
            <ArrowIcon className={sharedStyles.bodySectionLinkArrow()} />
        </Link>
    );

    return (
        <div className={styles.root()}>
            <div className={styles.infoCardGrid()}>
                {/* Affordable Card */}
                <div
                    className={`${styles.infoCard()} ${styles.mobileOnlyCardBorder()}`}
                >
                    <div className="flex justify-between items-start">
                        <h2 className={sharedStyles.bodySectionHeading()}>
                            {t("neighborhoodDetail.affordableCard.header")}
                        </h2>
                        {ecc && (
                            <div className={styles.eccCheckWrapper()}>
                                <p className="text-[#146604]">
                                    {t("neighborhoodDetail.eccYes")}
                                </p>
                                <CircleCheckIcon />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-5">
                        <p className={sharedStyles.bodySectionTextNormal()}>
                            <Trans
                                i18nKey="neighborhoodDetail.affordableCard.bodyText"
                                components={{ bold: <strong /> }}
                            >
                                Most families pay{" "}
                                <strong>
                                    no more than 30% of their income
                                </strong>{" "}
                                in rent.
                            </Trans>
                        </p>
                        {isMobile && <FindUnitsLink />}
                    </div>
                </div>

                {/* ECHO Benefits Card */}
                <div
                    className={`${styles.infoCard()} ${styles.mobileOnlyCardBorder()}`}
                >
                    <div className="flex justify-between items-start">
                        <h2 className={sharedStyles.bodySectionHeading()}>
                            {t("neighborhoodDetail.echoBenefitsCard.header")}
                        </h2>
                        {ecc && (
                            <div className={styles.eccCheckWrapper()}>
                                <p className="text-[#146604]">
                                    {t("neighborhoodDetail.eccYes")}
                                </p>
                                <CircleCheckIcon />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-5">
                        <p className={sharedStyles.bodySectionTextNormal()}>
                            <Trans i18nKey="neighborhoodDetail.echoBenefitsCard.bodyText">
                                <strong>Up to $6,750</strong> for security
                                deposit, broker fees, moving expenses, and more.
                            </Trans>
                        </p>
                        {isMobile && <FindUnitsLink />}
                    </div>
                </div>

                {/* Schools & Safety Card */}
                <div className={styles.infoCard()}>
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("neighborhoodDetail.schoolsSafetyCard.header")}
                    </h2>
                    <div className="flex flex-row gap-5">
                        <SchoolMeter
                            label={t(
                                "neighborhoodDetail.schoolsSafetyCard.schoolsLabel"
                            )}
                            value={education_percentile ?? 0}
                            isSchoolChoice={school_choice}
                            isBoston={isNeighborhoodBostonTownArea(town_area)}
                            showCategory
                            isDetailPage
                        />
                        <Meter
                            label={t(
                                "neighborhoodDetail.schoolsSafetyCard.safetyLabel"
                            )}
                            value={crime_percentile ?? 0}
                            showCategory
                        />
                    </div>
                </div>
            </div>

            {/* Your Trips */}
            <div
                className={`${sharedStyles.bodySectionWrapper()} ${sharedStyles.bodySectionWrapperBorder()}`}
            >
                <YourTrips activeNeighborhood={zipcode} isMobile={isMobile} />
            </div>

            {/* About this area section */}
            <div
                className={`${sharedStyles.bodySectionWrapper()} ${sharedStyles.bodySectionWrapperBorder()}}`}
            >
                <h2 className={sharedStyles.bodySectionHeading()}>
                    {t("neighborhoodDetail.aboutAreaSection.header")}
                </h2>
                <div className={styles.imageCarousel()}>
                    {NEIGHBORHOOD_IMG_TYPES.map((img_type, i) => (
                        <LicensedImage
                            key={i}
                            image={
                                neighborhood.properties[
                                    `${img_type}_image` as keyof NeighborhoodProperties
                                ] as string
                            }
                            description={
                                neighborhood.properties[
                                    `${img_type}_description` as keyof NeighborhoodProperties
                                ] as string
                            }
                            artist={
                                neighborhood.properties[
                                    `${img_type}_username` as keyof NeighborhoodProperties
                                ] as string
                            }
                            sourceLink={
                                neighborhood.properties[
                                    img_type as keyof NeighborhoodProperties
                                ] as string
                            }
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-2 items-start">
                    <p className={sharedStyles.bodySectionTextNormal()}>
                        {isDisplayingShortenedDesc
                            ? town_website_description.slice(
                                  0,
                                  DESC_MAX_LENGTH
                              ) + "..."
                            : town_website_description}
                    </p>
                    {isDisplayingShortenedDesc && (
                        <Button
                            onPress={() => setIsDisplayingShortenedDesc(false)}
                            className="text-sm font-bold"
                        >
                            {t(
                                "neighborhoodDetail.aboutAreaSection.readMoreButton"
                            )}
                        </Button>
                    )}
                </div>
                <div className="flex flex-col max-w-[400px] gap-3">
                    <p className="text-[17px] font-bold">
                        {t("neighborhoodDetail.learnMoreSection.subheader")}
                    </p>
                    <div className={sharedStyles.learnMoreLinksGroup()}>
                        <Link
                            href={town_link}
                            target="_blank"
                            className={`${sharedStyles.learnMoreLink()} ${sharedStyles.learnMoreLinkBorder()}`}
                        >
                            {t(
                                "neighborhoodDetail.learnMoreSection.websiteLink"
                            )}
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </Link>
                        <Link
                            href={wikipedia_link}
                            target="_blank"
                            className={`${sharedStyles.learnMoreLink()} ${sharedStyles.learnMoreLinkBorder()}`}
                        >
                            {t(
                                "neighborhoodDetail.learnMoreSection.wikipediaLink"
                            )}
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </Link>
                        <Link
                            href={`https://www.google.com/search?q=${encodeURIComponent(zipcode)}`}
                            target="_blank"
                            className={sharedStyles.learnMoreLink()}
                        >
                            {t(
                                "neighborhoodDetail.learnMoreSection.googleLink"
                            )}
                            <ArrowIcon
                                className={sharedStyles.learnMoreLinkArrow()}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoContent;
