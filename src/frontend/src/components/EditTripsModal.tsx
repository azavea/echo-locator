import { useState } from "react";
import type { Key } from "react-aria-components";
import { Dialog, Heading } from "react-aria-components";
import { useTranslation } from "react-i18next";

import {
    selectIsEditTripsOpen,
    setIsEditTripsOpen,
    setIsEditTripsWizardOpen,
} from "reducers/modalsDisplay/modalsDisplaySlice";
import {
    selectTrafficConditions,
    setTrafficConditions,
} from "reducers/networks/networksSlice";
import type { TrafficType } from "reducers/networks/types";
import type { UserProfileSliceState } from "reducers/userProfile/types";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import { selectUserProfile } from "reducers/userProfile/userSlice";
import { useAppDispatch, useAppSelector } from "store/store";

import Button from "components/base/Button/Button";
import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";
import { Accordion } from "./base/Accordion/Accordion";
import { AccordionItem } from "./base/Accordion/AccordionItem";
import CommuterRailCheckbox from "./CommuterRailCheckbox";
import ModalCloseButton from "./ModalCloseButton";
import TravelModeToggle from "./TravelModeToggle";

const modalHeadingClassName = "text-lg font-bold text-gray-900";

const EditTripsModal = ({ isMobile = false }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const modalOpen = useAppSelector(selectIsEditTripsOpen);
    const profile = useAppSelector(selectUserProfile);
    const trafficConditions = useAppSelector(selectTrafficConditions);
    const [profileBuffer, setProfileBuffer] =
        useState<UserProfileSliceState>(profile);

    // Update active destination
    const onSelectDestination = (keys: Iterable<string, void, undefined>) => {
        const selection = [...keys][0];
        if (!selection) return;
        const destinations = profileBuffer.destinations.map(d => {
            return { ...d, primary: d.location.label === selection };
        });
        setProfileBuffer({ ...profileBuffer, destinations: destinations });
    };

    // Directly update networks state for traffic changes. Avoids
    // race conditions correctly updating activeMode following user profile update
    const onTrafficChange = (keys: Iterable<Key, void, undefined>) => {
        const selection = [...keys][0];
        if (!selection) return;
        dispatch(setTrafficConditions(selection as TrafficType));
    };

    const onChangeHasVehicleToggle = (keys: Set<Key>) =>
        setProfileBuffer({
            ...profileBuffer,
            hasVehicle: keys.has("car"),
            useCommuterRail: keys.has("car")
                ? false
                : profileBuffer.useCommuterRail,
        });

    const onChangeCommuterCheckbox = (value: boolean) =>
        setProfileBuffer({
            ...profileBuffer,
            useCommuterRail: value,
        });

    const onOpenChange = (isOpen: boolean) => {
        dispatch(
            updateUserProfile({
                ...profileBuffer,
                voucherRooms: profileBuffer.rooms,
                importanceAccessibility: parseInt(
                    profileBuffer.importanceAccessibility
                ),
                importanceSchools: parseInt(profileBuffer.importanceSchools),
                importanceViolentCrime: parseInt(
                    profileBuffer.importanceViolentCrime
                ),
            })
        );
        dispatch(setIsEditTripsOpen(isOpen));
    };

    return (
        <ModalOverlay
            isDismissable
            isMobile={isMobile}
            isOpen={modalOpen}
            onOpenChange={onOpenChange}
        >
            <Modal size="medium" className="p-5 max-h-full overflow-y-scroll">
                <Dialog className="flex flex-col w-full gap-5">
                    <div>
                        <Heading slot="title" className={modalHeadingClassName}>
                            {t("editTripsModal.dialogHeading")}
                        </Heading>

                        <p className="text-sm text-gray-600">
                            {t("editTripsModal.dialogSubHeading")}
                        </p>
                        <ModalCloseButton onPress={() => onOpenChange(false)} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Accordion
                            defaultExpandedKeys={[
                                profileBuffer.activeDestination ??
                                    profileBuffer.destinations[0].location
                                        .label,
                            ]}
                            expandedItemCallback={onSelectDestination}
                            className="w-full"
                        >
                            {profileBuffer.destinations.map(destination => (
                                <AccordionItem
                                    id={destination.location.label}
                                    key={destination.location.label}
                                    title={t(
                                        `destinationPurposes.${destination.purpose}`
                                    )}
                                    subtitle={destination.location.label}
                                    overridePanelOpen
                                />
                            ))}
                        </Accordion>
                        <Button
                            variant="outline"
                            size="medium"
                            className="flex w-full"
                            onPress={() =>
                                dispatch(setIsEditTripsWizardOpen(true))
                            }
                        >
                            {t("yourTrips.editTrips")}
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className={modalHeadingClassName}>
                            {t("editTripsModal.trafficHeading")}
                        </h2>
                        <ToggleButtonGroup
                            selectionMode="single"
                            className="w-full"
                            selectedKeys={new Set([trafficConditions])}
                            onSelectionChange={(keys: Set<Key>) =>
                                keys.size === 1 && onTrafficChange(keys)
                            }
                        >
                            <ToggleButton
                                id="peak"
                                size="large"
                                className="w-full"
                            >
                                {t("editTripsModal.peak")}
                            </ToggleButton>
                            <ToggleButton
                                id="offPeak"
                                size="large"
                                className="w-full"
                            >
                                {t("editTripsModal.offPeak")}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className={modalHeadingClassName}>
                            {t("editTripsModal.travelModeHeading")}
                        </h2>
                        <TravelModeToggle
                            buffer={profileBuffer}
                            handleChange={onChangeHasVehicleToggle}
                        />
                        <CommuterRailCheckbox
                            buffer={profileBuffer}
                            handleChange={onChangeCommuterCheckbox}
                        />
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default EditTripsModal;
