import {
    selectIsEditProfileWizardOpen,
    setIsEditProfileWizardOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import { useAppDispatch, useAppSelector } from "src/store/store";
import EditWizard from "./EditWizard";
import StepBedroom from "./StepBedroom";
import StepImportance from "./StepImportance";
import StepTravelMode from "./StepTravelMode";

const EditUserProfileWizard = () => {
    const dispatch = useAppDispatch();
    const isWizardOpen = useAppSelector(selectIsEditProfileWizardOpen);
    return (
        <EditWizard
            isWizardOpen={isWizardOpen}
            setWizardOpen={isOpen =>
                dispatch(setIsEditProfileWizardOpen(isOpen))
            }
        >
            <StepBedroom />
            <StepImportance />
            <StepTravelMode />
        </EditWizard>
    );
};

export default EditUserProfileWizard;
