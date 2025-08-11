import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { UserProfileSubheaderMobile } from "components/UserProfileSubheader";
import { Place } from "src/enums";
import discoverDesktopStyles from "./Discover.styles";
import Neighborhoods from "./Neighborhoods";

const DiscoverMobile = () => {
    const [routerParams, setRouterParams] = useSearchParams();
    const display = routerParams.get("display");

    useEffect(() => {
        if (
            display === null ||
            (display && !["map", "list"].includes(display))
        ) {
            setRouterParams({ display: "map" });
        }
    }, [display]);

    const onChangeMode = (newDisplay: string) => {
        setRouterParams({ display: newDisplay });
    };

    const { root, headerContainer, map } = discoverDesktopStyles({
        isMobile: true,
    });

    return display ? (
        <div className={root()}>
            <div className={headerContainer()}>
                <UserProfileSubheaderMobile
                    size="small"
                    mode="transit"
                    place={Place.Work}
                    display={display}
                    callback={onChangeMode}
                />
            </div>
            {/* TODO: Implement Map mode neighborhood slides */}
            {display === "map" && <div className={map()}>Map container</div>}
            {display === "list" && <Neighborhoods mobile />}
        </div>
    ) : (
        <></>
    );
};

export default DiscoverMobile;
