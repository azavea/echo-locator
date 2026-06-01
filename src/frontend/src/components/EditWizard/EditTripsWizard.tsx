import {
    selectIsEditTripsWizardOpen,
    setIsEditTripsWizardOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import { useAppDispatch, useAppSelector } from "src/store/store";
import EditWizard from "./EditWizard";
import StepTrips from "./StepTrips";

const EditTripsWizard = () => {
    const dispatch = useAppDispatch();
    const isWizardOpen = useAppSelector(selectIsEditTripsWizardOpen);
    return (
        <EditWizard
            isWizardOpen={isWizardOpen}
            setWizardOpen={isOpen => dispatch(setIsEditTripsWizardOpen(isOpen))}
        >
            <StepTrips disableBack />
        </EditWizard>
    );
};

export default EditTripsWizard;
