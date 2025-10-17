import { useTranslation } from "react-i18next";

import Button from "../base/Button/Button";
import { top10TourStyles } from "./top10Tour.styles";

const Top10TourButton = ({
    isVisible,
    onClickCallback,
}: {
    isVisible: boolean;
    onClickCallback: () => void;
}) => {
    const { t } = useTranslation();
    const { openButtonContainer, openButtonColorBox, openButtonLabel } =
        top10TourStyles();
    return (
        <Button
            variant="unstyled"
            size="small"
            onPress={onClickCallback}
            className={`${isVisible ? "visible" : "invisible h-0"} ${openButtonContainer()}`}
        >
            <div className={openButtonColorBox()} />
            <span className={openButtonLabel()}>
                {t("top10Tour.showTopTen")}
            </span>
        </Button>
    );
};

export default Top10TourButton;
