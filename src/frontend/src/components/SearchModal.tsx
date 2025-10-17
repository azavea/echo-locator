import { Dialog, Heading } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import {
    selectIsSearchModalOpen,
    setIsEditTripsOpen,
    setIsSearchModalOpen,
} from "reducers/modalsDisplay/modalsDisplaySlice";
import { useAppSelector } from "src/store/store";
import ModalCloseButton from "./ModalCloseButton";

const SearchModal = ({ isMobile = false }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const modalOpen = useAppSelector(selectIsSearchModalOpen);
    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={modalOpen}
            onOpenChange={(isOpen: boolean) =>
                dispatch(setIsSearchModalOpen(isOpen))
            }
        >
            <Modal size="large">
                <Dialog>
                    <Heading slot="title">{t("searchModal")}</Heading>
                    <ModalCloseButton
                        onPress={() => dispatch(setIsEditTripsOpen(false))}
                    />
                    <div></div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default SearchModal;
