import { useEffect, useState } from "react";

import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import type { Destination } from "reducers/userProfile/types";
import { useAppSelector } from "store/store";

import { Accordion } from "components/base/Accordion/Accordion";
import { AccordionItem } from "components/base/Accordion/AccordionItem";
import Range from "components/base/Range/Range";
import { createGoogleDirectionsURL } from "libs/getLinkURLs";
import { MAX_TRAVEL_TIME } from "src/constants";
import { NonAccordionCommuteButton } from "./NonAccordionCommuteButton";
import TripMap from "./TripMap";
import type { TripType } from "./types";
import { yourTripsStyles } from "./YourTrips.styles";

const CommuteGroup = ({
    trips,
    isTransit,
    isMobile,
}: {
    trips: TripType[];
    isTransit?: boolean;
    isMobile?: boolean;
}) => {
    const styles = yourTripsStyles({
        isMobile: isMobile,
    });
    const [selectedMapDestination, setSelectedMapDestination] =
        useState<Destination | null>(null);
    const [selectedDestIsTooFar, setSelectedDestIsTooFar] = useState(false);
    const allNeighborhoodCommutes = useAppSelector(
        selectNeighborhoodZipcodeMap
    );

    const initialTrip = trips[0];
    if (!initialTrip) {
        return <></>;
    }

    const isTooFar = (trip: TripType) =>
        allNeighborhoodCommutes[trip.neighborhoodZipcode]?.commutes[
            trip.destination.location.label
        ].commuteMin > MAX_TRAVEL_TIME;

    useEffect(() => {
        setSelectedMapDestination(initialTrip.destination);
        setSelectedDestIsTooFar(isTooFar(initialTrip));
    }, [initialTrip.destination]);

    const getCommuteMin = (trip: TripType) =>
        allNeighborhoodCommutes[trip.neighborhoodZipcode]?.commutes[
            trip.destination.location.label
        ].commuteMin;

    const getCommuteMax = (trip: TripType) =>
        allNeighborhoodCommutes[trip.neighborhoodZipcode]?.commutes[
            trip.destination.location.label
        ].commuteMax;

    const onExpandItem = (keys: Iterable<any, void, undefined>) => {
        const selection = [...keys][0];
        if (selection) {
            // TODO will need to adjust for compare page
            setSelectedMapDestination(trips[parseInt(selection)].destination);
            if (!isTransit || selectedDestIsTooFar) {
                // open link
                const directionsURL = createGoogleDirectionsURL(
                    trips[parseInt(selection)].neighborhoodZipcode,
                    trips[parseInt(selection)].destination,
                    trips[parseInt(selection)].isTripToNeighborhood,
                    !!isTransit
                );
                window.open(directionsURL, "_blank");
            }
        }
    };

    return (
        <div className={styles.commuteGroupWrapper()}>
            {trips?.length === 1 ? (
                <NonAccordionCommuteButton
                    id={"0"}
                    key={0}
                    title={trips[0].title}
                    subtitle={trips[0].subtitle}
                    titleContentRight={
                        <Range
                            start={getCommuteMin(trips[0])}
                            end={getCommuteMax(trips[0])}
                        />
                    }
                    overridePanelOpen={!isTransit || selectedDestIsTooFar}
                    isMobile={isMobile}
                    onPress={() => onExpandItem(new Set("0"))}
                >
                    {isMobile && (
                        <TripMap
                            start={trips[0].destination}
                            end={initialTrip.neighborhoodZipcode}
                            isTransit={isTransit}
                        />
                    )}
                </NonAccordionCommuteButton>
            ) : (
                <Accordion
                    defaultExpandedKeys={["0"]}
                    expandedItemCallback={onExpandItem}
                    className={styles.commuteGroupItem()}
                >
                    {trips.map((trip, index) => (
                        <AccordionItem
                            id={index.toString()}
                            key={index}
                            title={trip.title}
                            subtitle={trip.subtitle}
                            titleContentRight={
                                <Range
                                    start={getCommuteMin(trip)}
                                    end={getCommuteMax(trip)}
                                    className="w-[80px]"
                                />
                            }
                            overridePanelOpen={!isTransit || isTooFar(trip)}
                            isMobile={isMobile}
                            lazyLoad={index > 0}
                        >
                            {isMobile && (
                                <TripMap
                                    start={trip.destination}
                                    end={initialTrip.neighborhoodZipcode}
                                    isTransit={isTransit}
                                />
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
            {!isMobile && selectedMapDestination && !selectedDestIsTooFar && (
                <TripMap
                    start={selectedMapDestination}
                    end={initialTrip.neighborhoodZipcode}
                    isTransit={isTransit}
                    className={styles.commuteGroupItem()}
                />
            )}
        </div>
    );
};

export default CommuteGroup;
