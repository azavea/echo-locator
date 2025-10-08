import { useEffect, useState } from "react";

import { useAppSelector } from "store/store";
import { Accordion } from "components/base/Accordion/Accordion";
import { AccordionItem } from "components/base/Accordion/AccordionItem";
import Range from "components/base/Range/Range";
import { yourTripsStyles } from "./YourTrips.styles";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { createGoogleDirectionsURL } from "libs/getLinkURLs";
import type { TripType } from "./types";
import type { Destination } from "reducers/userProfile/types";
import TripMap from "./TripMap";

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
    const allNeighborhoodCommutes = useAppSelector(
        selectNeighborhoodZipcodeMap
    );

    const initialTrip = trips[0];
    if (!initialTrip) {
        return <></>;
    }

    useEffect(() => {
        setSelectedMapDestination(initialTrip.destination);
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
            if (!isTransit) {
                // open link
                const directionsURL = createGoogleDirectionsURL(
                    trips[parseInt(selection)].neighborhoodZipcode,
                    trips[parseInt(selection)].destination,
                    trips[parseInt(selection)].tripToNeighborhood,
                    !!isTransit
                );
                window.open(directionsURL, "_blank");
            }
        }
    };

    return (
        <div className={styles.commuteGroupWrapper()}>
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
                            />
                        }
                        overridePanelOpen={!isTransit}
                        isMobile={isMobile}
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
            {!isMobile && selectedMapDestination && (
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
