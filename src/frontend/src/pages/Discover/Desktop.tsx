import { UserProfileSubheader } from "components/UserProfileSubheader";
import { Place } from "src/enums";
import discoverStyles from "./Discover.styles";
import Neighborhoods from "./Neighborhoods";
import Map from "./Map/Map";
import NeighborhoodDetail from "pages/NeighborhoodDetail";

const DiscoverDesktop = ({
    isDetailModalOpen,
    setIsDetailModalOpen,
}: {
    isDetailModalOpen: boolean;
    setIsDetailModalOpen: (b: boolean) => void;
}) => {
    const { root, sidebar, headerContainer } = discoverStyles({
        isMobile: false,
    });

    return (
        <div className={root()}>
            <NeighborhoodDetail
                modalOpen={isDetailModalOpen}
                modalOpenChangeCallback={setIsDetailModalOpen}
            />
            <div className={sidebar()}>
                <div className={headerContainer()}>
                    <UserProfileSubheader
                        size="medium"
                        mode="transit"
                        place={Place.Work}
                    />
                </div>
                <Neighborhoods mobile={false} />
            </div>
            <Map isMobile={false} />
        </div>
    );
};

export default DiscoverDesktop;
