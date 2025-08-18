import { UserProfileSubheader } from "components/UserProfileSubheader";
import { Place } from "src/enums";
import discoverStyles from "./Discover.styles";
import Neighborhoods from "./Neighborhoods";
import Map from "./Map/Map";

const DiscoverDesktop = () => {
    const { root, sidebar, headerContainer } = discoverStyles({
        isMobile: false,
    });

    return (
        <div className={root()}>
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
