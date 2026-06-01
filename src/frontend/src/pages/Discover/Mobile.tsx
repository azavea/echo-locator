import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { UserProfileSubheaderMobile } from "components/UserProfileSubheader";
import discoverStyles from "./Discover.styles";
import Map from "./Map/Map";
import ModalsWrapper from "./ModalsWrapper";
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

    const { root, headerContainer } = discoverStyles({
        isMobile: true,
    });

    return display ? (
        <div className={root()}>
            <ModalsWrapper isMobile />
            <div className={headerContainer()}>
                <UserProfileSubheaderMobile
                    size="small"
                    display={display}
                    callback={onChangeMode}
                />
            </div>
            <Map mapDisplay={display === "map"} />
            <Neighborhoods mobile listDisplay={display === "list"} />
        </div>
    ) : (
        <></>
    );
};

export default DiscoverMobile;
