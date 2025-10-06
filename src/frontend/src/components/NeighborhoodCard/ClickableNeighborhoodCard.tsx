import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { NeighborhoodCardProps } from "./NeighborhoodCard";
import NeighborhoodCard from "./NeighborhoodCard";
import Button from "components/base/Button/Button";

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
        <Button onPress={handleOnPress} variant="unstyled">
            <NeighborhoodCard {...props} />
        </Button>
    );
};

export default ClickableNeighborhoodCard;
