import { UserProfileSubheader } from "components/UserProfileSubheader";
import { Place } from "src/enums";
import discoverDesktopStyles from "./Discover.styles";
import Neighborhoods from "./Neighborhoods";

const DiscoverDesktop = () => {
    const { root, sidebar, headerContainer, map } = discoverDesktopStyles({
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

            {/* Map */}
            <div className={map()}>Map Content</div>
        </div>
    );
};

export default DiscoverDesktop;
