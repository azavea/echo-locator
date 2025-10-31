import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { setIsNeighborhoodDetailsOpen } from "reducers/modalsDisplay/modalsDisplaySlice";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { updateUserProfile } from "reducers/userProfile/userProfileThunk";
import {
    selectActiveDestination,
    selectUserProfile,
} from "reducers/userProfile/userSlice";
import { useAppDispatch, useAppSelector } from "store/store";

import ComparePageImage from "assets/icons/ComparePageImage.svg?react";
import EditTripsWizard from "components/EditWizard/EditTripsWizard";
import ClickableNeighborhoodCard from "components/NeighborhoodCard/ClickableNeighborhoodCard";
import useMediaQuery from "hooks/useMediaQuery";
import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";
import NeighborhoodDetail from "../NeighborhoodDetail";
import compareStyles from "./Compare.styles";

const Compare = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const {
        root,
        title,
        content,
        description,
        imageCarousel,
        imageCarouselWrapper,
    } = compareStyles({
        isMobile: !isDesktop,
    });
    const profile = useAppSelector(selectUserProfile);
    const { zipcode } = useParams();
    const { favorites } = profile;
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);

    // Formatted into UserProfile type for update request
    const formattedProfile = {
        ...profile,
        voucherRooms: profile.rooms,
        importanceAccessibility: parseInt(profile.importanceAccessibility),
        importanceSchools: parseInt(profile.importanceSchools),
        importanceViolentCrime: parseInt(profile.importanceViolentCrime),
    };

    useEffect(() => {
        dispatch(setIsNeighborhoodDetailsOpen(!!zipcode));
    }, [zipcode]);

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

    return (
        <div className={root()}>
            <EditTripsWizard />
            <NeighborhoodDetail isMobile={!isDesktop} />
            <p className={title()}>{t("comparePage.title")}</p>
            {!favorites.length ? (
                <div className={content()}>
                    <ComparePageImage />
                    <p className={description()}>
                        {t("comparePage.introDescription")}
                    </p>
                </div>
            ) : (
                <div className={imageCarouselWrapper()}>
                    <h2 className="text-lg font-bold text-gray-900 pl-6">
                        {t("comparePage.subtitle")}
                    </h2>
                    <div className={imageCarousel()}>
                        {favorites.map((zipcode, i) => (
                            <ClickableNeighborhoodCard
                                key={i}
                                className={`${isDesktop ? "max-w-[280px]" : "w-full p-0"}`}
                                {...getFavoriteImageCardByZip(zipcode)}
                                onClose={() => handleUnfavorite(zipcode)}
                                isMobile={!isDesktop}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
