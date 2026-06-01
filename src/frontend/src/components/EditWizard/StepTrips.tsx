import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Destination } from "reducers/userProfile/types";

import PlusIcon from "assets/icons/plus.svg?react";
import TimesIcon from "assets/icons/times.svg?react";
import Button from "components/base/Button/Button";
import WizardStep from "components/Wizard/WizardStep";
import AddTripModal from "pages/Discover/Profile/AddTripModal";
import { selectInvalidTimesAndPathsData } from "reducers/networks/networksSlice";
import { useAppSelector } from "store/store";
import type { BaseProps } from "../../pages/Discover/Profile/types";

interface TripsStepProps extends BaseProps {
    disableBack?: boolean;
}

const StepTrips = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
    disableBack,
}: TripsStepProps) => {
    const { t } = useTranslation();
    const invalidData = useAppSelector(selectInvalidTimesAndPathsData);
    const [addTripModalOpen, setIsAddTripModalOpen] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    if (!buffer || !setProfileBuffer || !handleBack || !handleNext) {
        return <></>;
    }
    const destinations = buffer.destinations;

    const onRemoveDestination = (destinationIndex: number) => {
        const updatedDestinations = [...destinations];
        updatedDestinations.splice(destinationIndex, 1);
        setProfileBuffer(state => ({
            ...state,
            destinations: updatedDestinations,
        }));
    };

    const onAddDestination = (destination: Destination) => {
        setProfileBuffer(state => ({
            ...state,
            destinations: [...destinations, destination],
        }));
        setIsAddTripModalOpen(false);
    };

    useEffect(() => {
        setShowErrorMessage(
            destinations.some(d => invalidData?.includes(d.location.label))
        );
    }, [destinations, invalidData]);

    return (
        <WizardStep
            question={t("userTrip.wizard.stepAddTrip.question")}
            description={t("userTrip.wizard.stepAddTrip.description")}
            buttonText={t("userTrip.wizard.button.finish")}
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={!destinations.length || showErrorMessage}
            disableBack={disableBack}
        >
            <AddTripModal
                isModalOpen={addTripModalOpen}
                isModalOpenChangeCallback={isOpen =>
                    setIsAddTripModalOpen(isOpen)
                }
                handleBack={() => setIsAddTripModalOpen(false)}
                handleNext={onAddDestination}
            />
            {showErrorMessage && (
                <div className="text-sm text-red-900">
                    {t("userTrip.wizard.stepAddTrip.error")}
                </div>
            )}
            <div className="flex flex-col gap-3">
                {destinations.map((destination, index) => (
                    <div
                        key={index}
                        className={`w-full flex flex-row justify-between items-start rounded-2xl p-4  ${invalidData?.includes(destination.location.label) ? "bg-red-100" : "bg-gray-100"}`}
                    >
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {t([
                                    "destinationPurposes." +
                                        destination.purpose,
                                ])}
                            </h2>
                            <p className="max-w-40 flex flex-wrap font-normal text-gray-600 text-sm">
                                {destination.location.label}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="small"
                            leftIcon={
                                <TimesIcon className="h-5 w-5 font-ligth fill-black" />
                            }
                            onPress={() => onRemoveDestination(index)}
                            className="h-7 w-7 py-2 px-3"
                        />
                    </div>
                ))}
            </div>
            <Button
                variant="outline"
                size="large"
                leftIcon={
                    <PlusIcon className="h-[18px] w-[18px] fill-gray-600" />
                }
                className="justify-normal text-gray-700 text-lg font-bold"
                onPress={() => setIsAddTripModalOpen(true)}
            >
                {destinations.length
                    ? t("userTrip.wizard.stepAddTrip.addAnotherTrip")
                    : t("userTrip.wizard.stepAddTrip.addATrip")}
            </Button>
        </WizardStep>
    );
};

export default StepTrips;
