import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router";
import { useDispatch } from "react-redux";
import type { Key } from "react-aria-components";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "store/store";
import { ModalOverlay, Modal } from "components/base/Modal/Modal";
import neighborhoodDetailStyles from "./styles/NeighborhoodDetail.styles";
import Button from "components/base/Button/Button";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";

import TimesIcon from "assets/icons/times.svg?react";
import StarIcon from "assets/icons/star.svg?react";
import FamilyIcon from "assets/icons/family.svg?react";
import InfoContent from "./InfoContent";
import Map from "./Map/Map";
import {
    selectActiveNeighborhoodFeature,
    setActiveNeighborhood,
} from "reducers/neighborhoods/neighborhoodsSlice";
import { selectAllNetworksDataReady } from "reducers/networks/networksSlice";
import UnitsContent from "./UnitsContent";
import {
    selectIsNeighborhoodDetailsOpen,
    setIsNeighborhoodDetailsOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";

const NeighborhoodDetail = ({ isMobile }: { isMobile?: boolean }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, _] = useSearchParams();
    const { t } = useTranslation();
    const styles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const { zipcode } = useParams();
    const modalOpen = useAppSelector(selectIsNeighborhoodDetailsOpen);
    const networksDataIsReady = useAppSelector(selectAllNetworksDataReady);
    const neighborhood = useAppSelector(selectActiveNeighborhoodFeature);
    const [contentDisplayOption, setContentDisplayOption] = useState(
        new Set<Key>(["info"])
    );
    const [displayInfoContent, setDisplayInfoContent] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (
            zipcode &&
            networksDataIsReady &&
            neighborhood?.properties.zipcode !== zipcode
        ) {
            dispatch(setActiveNeighborhood(zipcode));
        }
    }, [zipcode, networksDataIsReady, neighborhood]);

    const onChangeDisplayOption = (keys: Set<Key>) => {
        if (keys.size === 0) {
            setContentDisplayOption(contentDisplayOption);
            return;
        }
        setContentDisplayOption(keys);
        setDisplayInfoContent([...keys][0] === "info");
    };

    const forceToggleUnits = () =>
        onChangeDisplayOption(new Set<Key>(["units"]));

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            dispatch(setIsNeighborhoodDetailsOpen(isOpen));
            zipcode &&
                navigate(
                    `${location.pathname.replace(`/${zipcode}`, "")}?display=${searchParams.get("display")}`,
                    {
                        replace: true,
                    }
                );
        }
    };

    return (
        neighborhood && (
            <ModalOverlay
                isDismissable
                isMobile
                isOpen={modalOpen}
                onOpenChange={handleOnOpenChange}
            >
                <Modal
                    size="large"
                    overideVerticalCenter
                    className={styles.root()}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className={styles.closeButton()}
                        onPress={_ => handleOnOpenChange(false)}
                        aria-label="Close"
                        leftIcon={<TimesIcon className={styles.closeIcon()} />}
                    />
                    <div className={styles.headerMapContainer()}>{<Map />}</div>
                    <div className={styles.headerContainer()}>
                        <div className={styles.headerContent()}>
                            <div className={styles.headerLabelWrapper()}>
                                <h1
                                    className={styles.headerNeighborhoodLabel()}
                                >
                                    {neighborhood.properties.town}
                                </h1>
                                <h2 className={styles.headerZipcodeLabel()}>
                                    {neighborhood.properties.zipcode}
                                </h2>
                            </div>
                            <Button
                                variant="orange"
                                size="medium"
                                leftIcon={
                                    <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                }
                                className={isMobile ? "w-full" : "160px"}
                            >
                                {t("neighborhoodDetail.addToFavorites")}
                            </Button>
                        </div>
                        {neighborhood.properties.family_move_count == 0 && (
                            <div className={styles.iconWithTextWrapper()}>
                                <FamilyIcon className={styles.inlineIcon()} />
                                <p className="text-gray-600 text-sm self-center">
                                    {t("neighborhoodDetail.moveCountText", {
                                        count: neighborhood.properties
                                            .family_move_count,
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className={styles.contentContainer()}>
                        <div className={styles.toggleGroup()}>
                            <ToggleButtonGroup
                                selectionMode="single"
                                selectedKeys={contentDisplayOption}
                                onSelectionChange={onChangeDisplayOption}
                                className="w-full"
                            >
                                <ToggleButton
                                    id="info"
                                    size="medium"
                                    className="w-full text-md"
                                >
                                    {t("neighborhoodDetail.infoToggleLabel")}
                                </ToggleButton>
                                <ToggleButton
                                    id="units"
                                    size="medium"
                                    className="w-full text-md"
                                >
                                    {t("neighborhoodDetail.unitsToggleLabel")}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <InfoContent
                            display={displayInfoContent}
                            isMobile={isMobile}
                            neighborhood={neighborhood}
                            unitsLinkCallback={forceToggleUnits}
                        />
                        <UnitsContent
                            display={!displayInfoContent}
                            isMobile={isMobile}
                            neighborhood={neighborhood}
                        />
                    </div>
                </Modal>
            </ModalOverlay>
        )
    );
};

export default NeighborhoodDetail;
