import { UserProfileSubheader } from "components/UserProfileSubheader";
import discoverStyles from "./Discover.styles";
import Map from "./Map/Map";
import ModalsWrapper from "./ModalsWrapper";
import Neighborhoods from "./Neighborhoods";

const DiscoverDesktop = () => {
    const { root, sidebar, headerContainer } = discoverStyles({
        isMobile: false,
    });

    return (
        <div className={root()}>
            <ModalsWrapper />
            <div className={sidebar()}>
                <div className={headerContainer()}>
                    <UserProfileSubheader size="medium" />
                </div>
                <Neighborhoods mobile={false} />
            </div>
            <Map isMobile={false} />
        </div>
    );
};

export default DiscoverDesktop;
