import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router";
import { useDispatch } from "react-redux";
import type { Key } from "react-aria-components";

import { useAppSelector } from "store/store";
import { ModalOverlay, Modal } from "components/base/Modal/Modal";
import neighborhoodDetailStyles from "./NeighborhoodDetail.styles";
import Button from "src/components/base/Button/Button";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "src/components/base/ToggleButton/ToggleButton";

import TimesIcon from "assets/icons/times.svg?react";
import StarIcon from "assets/icons/star.svg?react";
import FamilyIcon from "assets/icons/family.svg?react";
import {
    selectActiveNeighborhoodFeature,
    setActiveNeighborhood,
} from "src/reducers/neighborhoods/neighborhoodsSlice";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";

const NeighborhoodDetail = ({
    modalOpen,
    modalOpenChangeCallback,
    isMobile,
}: {
    modalOpen: boolean;
    modalOpenChangeCallback: (b: boolean) => void;
    isMobile?: boolean;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, _] = useSearchParams();
    const styles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });

    const { zipcode } = useParams();
    const networksDataIsReady = useAppSelector(selectAllNetworksDataReady);
    const neighborhood = useAppSelector(selectActiveNeighborhoodFeature);
    const [contentDisplayOption, setContentDisplayOption] = useState(
        new Set<Key>(["info"])
    );
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
    };

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            modalOpenChangeCallback(isOpen);
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
                    <div className={styles.headerMapContainer()}></div>
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
                                Add to favorites
                            </Button>
                        </div>
                        {neighborhood.properties.family_move_count == 0 && (
                            <div className={styles.headerMoveCountWrapper()}>
                                <FamilyIcon className={styles.inlineIcon()} />
                                <p className="text-gray-600 text-sm self-center">
                                    {neighborhood.properties.family_move_count}{" "}
                                    voucher holders moved here already!
                                </p>
                            </div>
                        )}
                    </div>
                    <div className={styles.contentContainer()}>
                        <ToggleButtonGroup
                            selectionMode="single"
                            selectedKeys={contentDisplayOption}
                            onSelectionChange={onChangeDisplayOption}
                            className={isMobile ? "w-full" : "w-[350px]"}
                        >
                            <ToggleButton
                                id="info"
                                size="large"
                                className="w-full"
                            >
                                Infos
                            </ToggleButton>
                            <ToggleButton
                                id="units"
                                size="large"
                                className="w-full"
                            >
                                Find Units
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </Modal>
            </ModalOverlay>
        )
    );
};

export default NeighborhoodDetail;
