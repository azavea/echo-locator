import { useState } from "react";

import InputText from "components/InputText";
import NeighborhoodCard from "components/NeighborhoodCard/NeighborhoodCard";
import discoverStyles from "./Discover.styles";

const cardFull = {
    imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Washington_and_Harvard_Streets%2C_Brookline_Village_MA.jpg",
    stats: {
        schools: { label: "Schools", value: 25, showCategory: true },
        safety: { label: "Safety", value: 75, showCategory: true },
        commute: {
            label: "Commute",
            start: 10,
            end: 25,
        },
    },
};

const Neighborhoods = ({ mobile, listDisplay }: { mobile: boolean, listDisplay: boolean }) => {
    const [mediumTextInput, setMediumTextInput] = useState<string>("");
    const {
        recoContainer,
        subTitleContainer,
        subTitle,
        description,
        swatch,
        recoList,
        recoTitleContainer,
        recoTitle,
        recoDescription,
    } = discoverStyles({ isMobile: mobile, mobileListDisplay: mobile ? listDisplay : true });

    return (
        <div className={recoContainer()}>
            {/* TODO: Neighborhood search */}
            <InputText
                label="Text input"
                placeholder="Search neighborhoods"
                value={mediumTextInput}
                onChange={setMediumTextInput}
            />

            {/* Sub-title */}
            <div className={subTitleContainer()}>
                <p className={subTitle()}>Discover Neighborhoods</p>
                <p className={description()}>
                    Recommendations are based on your profile and selected trip
                </p>
            </div>

            {/* Recommendation list */}
            <div className={recoList()}>
                <div>
                    {/* TODO: Change copy based on search result */}
                    <div className={recoTitleContainer()}>
                        <p className={recoTitle()}>Top 10</p>
                        <div className={swatch()}></div>
                    </div>
                    <p className={recoDescription()}>
                        Highest-ranked recommendations
                    </p>
                </div>
                {/* TODO: read list of neighborhoods from prop */}
                {new Array(10).fill(0).map((_, idx) => (
                    <NeighborhoodCard
                        {...cardFull}
                        key={idx}
                        name="Brookline"
                        zip="02446"
                        isTopTen
                        hasECC
                    />
                ))}
            </div>
        </div>
    );
};

export default Neighborhoods;
