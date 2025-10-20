import { ModalOverlay, Modal } from "components/base/Modal/Modal";
import { Dialog, Heading } from "react-aria-components";
import { useDispatch } from "react-redux";
import {
    selectIsEditTripsOpen,
    setIsEditTripsOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import { useAppSelector } from "src/store/store";
import ModalCloseButton from "./ModalCloseButton";

const EditTripsModal = () => {
    const dispatch = useDispatch();
    const modalOpen = useAppSelector(selectIsEditTripsOpen);
    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={modalOpen}
            onOpenChange={(isOpen: boolean) =>
                dispatch(setIsEditTripsOpen(isOpen))
            }
        >
            <Modal size="large">
                <Dialog>
                    <Heading slot="title">Trips</Heading>
                    <ModalCloseButton
                        onPress={() => dispatch(setIsEditTripsOpen(false))}
                    />
                    <div></div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default EditTripsModal;
