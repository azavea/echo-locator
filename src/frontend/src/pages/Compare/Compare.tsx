import { useTranslation } from "react-i18next";

import ComparePageImage from "assets/icons/ComparePageImage.svg?react";
import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";
import NeighborhoodCard from "src/components/NeighborhoodCard/NeighborhoodCard";
import useMediaQuery from "src/hooks/useMediaQuery";
import selectNeighborhoodZipcodeMap from "src/reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { updateUserProfile } from "src/reducers/userProfile/userProfileThunk";
import {
    selectActiveDestination,
    selectUserProfile,
} from "src/reducers/userProfile/userSlice";
import { useAppDispatch, useAppSelector } from "src/store/store";
import compareStyles from "./Compare.styles";

const Compare = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { root, title, content, description, imageCarousel } = compareStyles({
        isMobile: !isDesktop,
    });
    const profile = useAppSelector(selectUserProfile);
    const { favorites } = profile;
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);

    const profileBuffer = {
        ...profile,
        voucherRooms: profile.rooms,
        importanceAccessibility: parseInt(profile.importanceAccessibility),
        importanceSchools: parseInt(profile.importanceSchools),
        importanceViolentCrime: parseInt(profile.importanceViolentCrime),
    };

    const getFavoriteImageCardByZip = (zip: string) => {
        if (!activeDestination) return { zip: zip, name: "" };
        const { cardImageOnly } = formatNeighborhoodDataByViewType(
            neighborhoodDetailsMap[zip],
            activeDestination,
            false
        );
        return cardImageOnly;
    };

    const handleUnfavorite = (zipcode: string) => {
        const favorites = [...profileBuffer.favorites];
        const indexOfZip = favorites.indexOf(zipcode);
        if (indexOfZip === -1) return;
        favorites.splice(indexOfZip, 1);
        dispatch(
            updateUserProfile({
                ...profileBuffer,
                favorites: favorites,
            })
        );
    };

    return (
        <div className={root()}>
            <p className={title()}>{t("comparePage.title")}</p>
            {!favorites.length ? (
                <div className={content()}>
                    <ComparePageImage />
                    <p className={description()}>
                        {t("comparePage.introDescription")}
                    </p>
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {t("comparePage.subtitle")}
                    </h2>
                    <div className={imageCarousel()}>
                        {favorites.map(zipcode => (
                            <div className="max-w-[280px]">
                                <NeighborhoodCard
                                    {...getFavoriteImageCardByZip(zipcode)}
                                    onClose={() => handleUnfavorite(zipcode)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
