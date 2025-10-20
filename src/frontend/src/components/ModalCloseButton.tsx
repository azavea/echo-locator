import Button from "./base/Button/Button";
import TimesIcon from "assets/icons/times.svg?react";

const ModalCloseButton = ({ onPress }: { onPress: () => void }) => (
    <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-1 size-[34px] rounded-[12px] items-center justify-center ring-inset bg-white shadow-sm"
        onPress={onPress}
        aria-label="Close"
        leftIcon={<TimesIcon className="h-5" />}
    />
);

export default ModalCloseButton;
