import { ModalOverlay, Modal } from "components/base/Modal/Modal";
import { Dialog, Heading } from "react-aria-components";
import { useDispatch } from "react-redux";
import {
    selectIsEditFiltersOpen,
    setIsEditFiltersOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import { useAppSelector } from "src/store/store";

const EditFiltersModal = () => {
    const dispatch = useDispatch();
    const modalOpen = useAppSelector(selectIsEditFiltersOpen);
    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={modalOpen}
            onOpenChange={(isOpen: boolean) =>
                dispatch(setIsEditFiltersOpen(isOpen))
            }
        >
            <Modal size="large">
                {" "}
                <Dialog>
                    <Heading slot="title">Filters</Heading>
                    <div></div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default EditFiltersModal;
