import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import StarIcon from "assets/icons/star.svg?react";
import Button from "components/base/Button/Button";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import { useAppDispatch, useAppSelector } from "store/store";
import CompareFavoritesButton from "./CompareFavoritesButton";

interface Props {
    zipcode?: string;
    size?: "small" | "medium" | "large";
}
const FavoriteButton = ({ zipcode, size = "large" }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const profile = useAppSelector(state => state.userProfile);
    if (!zipcode) {
        return <></>;
    }
    const isFavorited = profile.favorites.includes(zipcode);
    // Formatted into UserProfile type for update request
    const formattedProfile = {
        ...profile,
        voucherRooms: profile.rooms,
        importanceAccessibility: parseInt(profile.importanceAccessibility),
        importanceSchools: parseInt(profile.importanceSchools),
        importanceViolentCrime: parseInt(profile.importanceViolentCrime),
    };

    const handleAddFavorite = () => {
        dispatch(
            updateUserProfile({
                ...formattedProfile,
                favorites: [...formattedProfile.favorites, zipcode],
            })
        );
    };

    const handleUnfavorite = () => {
        const favorites = [...formattedProfile.favorites];
        const indexOfZip = favorites.indexOf(zipcode);
        if (indexOfZip === -1) return;
        favorites.splice(indexOfZip, 1);
        dispatch(
            updateUserProfile({
                ...formattedProfile,
                favorites: favorites,
            })
        );
    };

    const handleViewCompare = () => {
        navigate("/compare");
    };

    return isFavorited ? (
        <CompareFavoritesButton
            unfavoriteCallback={handleUnfavorite}
            compareCallback={handleViewCompare}
            size={size}
            isDisabled={profile.loading}
        />
    ) : (
        <Button
            variant="orange"
            size={size}
            leftIcon={
                <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
            }
            onPress={handleAddFavorite}
            className="min-w-[230px]"
            isDisabled={profile.loading}
        >
            {t("neighborhoodDetail.addToFavorites")}
        </Button>
    );
};

export default FavoriteButton;
