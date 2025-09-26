import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Button as AriaButton } from "react-aria-components";
import type { NeighborhoodCardProps } from "./NeighborhoodCard";
import NeighborhoodCard from "./NeighborhoodCard";

interface Props extends NeighborhoodCardProps {
    isMobile?: boolean;
}

const ClickableNeighborhoodCard = (props: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, _] = useSearchParams();
    const handleOnPress = () => {
        navigate(
            `${location.pathname}/${props.zip}?display=${searchParams.get("display")}`,
            {
                replace: true,
            }
        );
    };

    return (
        <AriaButton onPress={handleOnPress}>
            <NeighborhoodCard {...props} />
        </AriaButton>
    );
};

export default ClickableNeighborhoodCard;
