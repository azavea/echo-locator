import Button from "components/base/Button/Button";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { NeighborhoodCardProps } from "./NeighborhoodCard";
import NeighborhoodCard from "./NeighborhoodCard";

interface Props extends NeighborhoodCardProps {
    className?: string;
    isMobile?: boolean;
}

const ClickableNeighborhoodCard = (props: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, _] = useSearchParams();
    const displayPath = searchParams.get("display")
        ? `?display=${searchParams.get("display")}`
        : "";
    const handleOnPress = () => {
        navigate(`${location.pathname}/${props.zip}${displayPath}`);
    };

    return (
        <Button
            onPress={handleOnPress}
            variant="unstyled"
            className={props.className}
        >
            <NeighborhoodCard {...props} />
        </Button>
    );
};

export default ClickableNeighborhoodCard;
