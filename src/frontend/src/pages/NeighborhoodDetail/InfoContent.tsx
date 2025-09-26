import { Link, Button } from "react-aria-components";

import infoTabStyles from "./styles/infoTab.styles";
import Meter from "components/base/Meter/Meter";
import type {
    Neighborhood,
    NeighborhoodProperties,
} from "src/reducers/neighborhoods/types";
import CircleCheckIcon from "assets/icons/circle-check.svg?react";
import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import { LicensedImage } from "src/components/CCLicensedImage";
import { useEffect, useState } from "react";

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
}: {
    display: boolean;
    isMobile?: boolean;
    neighborhood: Neighborhood;
}) => {
    const DESC_MAX_LENGTH = isMobile ? 125 : 225;
    const [isDisplayingShortenedDesc, setIsDisplayingShortenedDesc] =
        useState(true);
    const styles = infoTabStyles({
        isMobile: isMobile,
        display: display,
    });

    if (!neighborhood) {
        return false;
    }

    const {
        properties: {
            ecc,
            zipcode,
            crime_percentile,
            education_percentile,
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

    return (
        <div className={styles.infoContentContainer()}>
            <div className={styles.infoCardGrid()}>
                {/* Affordable Card */}
                <div
                    className={`${styles.infoCard()} ${styles.mobileCardBorder()}`}
                >
                    <div className={styles.cardHeaderWrapper()}>
                        <h2 className={styles.cardHeader()}>Affordable</h2>
                        {ecc && (
                            <div className={styles.eccCheckWrapper()}>
                                <p className="text-[#146604]">Yes</p>
                                <CircleCheckIcon />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-5">
                        <p className="text-[17px] text-gray-600">
                            Most families pay{" "}
                            <span className="text-gray-900 font-bold">
                                no more than 30% of their income
                            </span>{" "}
                            in rent.
                        </p>
                        {isMobile && (
                            <Link
                                onPress={() => alert("Pressed link")}
                                className="font-normal text-gray-700"
                            >
                                Go to{" "}
                                <span className="font-bold">Find Units</span> to
                                learn more
                            </Link>
                        )}
                    </div>
                </div>

                {/* ECHO Benefits Card */}
                <div
                    className={`${styles.infoCard()} ${styles.mobileCardBorder()}`}
                >
                    <div className={styles.cardHeaderWrapper()}>
                        <h2 className={styles.cardHeader()}>ECHO Benefits</h2>
                        {ecc && (
                            <div className={styles.eccCheckWrapper()}>
                                <p className="text-[#146604]">Yes</p>
                                <CircleCheckIcon />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-5">
                        <p className="text-[17px] text-gray-600">
                            <span className="text-gray-900 font-bold">
                                Up to $6,750
                            </span>{" "}
                            for security deposit, broker fees, moving expenses,
                            and more.
                        </p>
                        {isMobile && (
                            <Link
                                onPress={() => alert("Pressed link")}
                                className="font-normal text-gray-700"
                            >
                                Go to{" "}
                                <span className="font-bold">Find Units</span> to
                                learn more
                            </Link>
                        )}
                    </div>
                </div>

                {/* Schools & Safety Card */}
                <div className={styles.infoCard()}>
                    <div className={styles.cardHeaderWrapper()}>
                        <h2 className={styles.cardHeader()}>
                            Schools & Safety
                        </h2>
                    </div>
                    <div className="flex flex-row gap-5">
                        <Meter
                            label="Schools"
                            value={crime_percentile ?? 0}
                            showCategory
                        />
                        <Meter
                            label="Safety"
                            value={education_percentile ?? 0}
                            showCategory
                        />
                    </div>
                </div>
            </div>

            {/* About this area section */}
            <div className={styles.aboutSection()}>
                <h2 className={styles.cardHeader()}>About this area</h2>
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
                            licenseLink={
                                neighborhood.properties[
                                    `${img_type}_license_url` as keyof NeighborhoodProperties
                                ] as string
                            }
                            license={
                                neighborhood.properties[
                                    `${img_type}_license` as keyof NeighborhoodProperties
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
                    <p className={styles.aboutText()}>
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
                            READ MORE
                        </Button>
                    )}
                </div>
                <div className="flex flex-col max-w-[400px] gap-3">
                    <p className="text-[17px] font-bold">Learn more</p>
                    <div className={styles.learnMoreLinksGroup()}>
                        <Link
                            href={town_link}
                            className={`${styles.learnMoreLink()} ${styles.learnMoreLinkBorder()}`}
                        >
                            Website
                            <ArrowIcon
                                className={styles.learnMoreLinkArrow()}
                            />
                        </Link>
                        <Link
                            href={wikipedia_link}
                            className={`${styles.learnMoreLink()} ${styles.learnMoreLinkBorder()}`}
                        >
                            Wikipedia
                            <ArrowIcon
                                className={styles.learnMoreLinkArrow()}
                            />
                        </Link>
                        <Link
                            href={`https://www.google.com/search?q=${encodeURIComponent(zipcode)}`}
                            className={styles.learnMoreLink()}
                        >
                            Google
                            <ArrowIcon
                                className={styles.learnMoreLinkArrow()}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoContent;
