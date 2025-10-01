import { Accordion } from "../base/Accordion/Accordion";
import { AccordionItem } from "../base/Accordion/AccordionItem";
import Range from "components/base/Range/Range";
import { yourTripsStyles } from "./YourTrips.styles";
import { useAppSelector } from "src/store/store";
import selectNeighborhoodZipcodeMap from "src/reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { createGoogleDirectionsURL } from "src/libs/getLinkURLs";
import type { TripType } from "./types";
import { useState } from "react";
import type { Destination } from "src/reducers/userProfile/types";
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
        useState<Destination>(trips[0].destination);
    const allNeighborhoodCommutes = useAppSelector(
        selectNeighborhoodZipcodeMap
    );

    return (
        <div className={styles.commuteGroupWrapper()}>
            <Accordion
                defaultExpandedKeys={["0"]}
                expandedItemCallback={keys => {
                    const selection = [...keys][0];
                    if (selection) {
                        // TODO will need to adjust for compare page
                        setSelectedMapDestination(
                            trips[parseInt(selection)].destination
                        );
                        if (!isTransit) {
                            // open link
                            const directionsURL = createGoogleDirectionsURL(
                                trips[selection].neighborhoodZipcode,
                                trips[selection].destination,
                                trips[selection].tripToNeighborhood,
                                !!isTransit
                            );
                            window.open(directionsURL, "_blank");
                        }
                    }
                }}
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
                                start={
                                    allNeighborhoodCommutes[
                                        trip.neighborhoodZipcode
                                    ]?.commutes[trip.destination.location.label]
                                        .commuteMin
                                }
                                end={
                                    allNeighborhoodCommutes[
                                        trip.neighborhoodZipcode
                                    ]?.commutes[trip.destination.location.label]
                                        .commuteMax
                                }
                            />
                        }
                        overridePanelOpen={!isTransit}
                        isMobile={isMobile}
                    >
                        {isMobile && <TripMap start={trip.destination} />}
                    </AccordionItem>
                ))}
            </Accordion>
            {!isMobile && (
                <TripMap
                    start={selectedMapDestination}
                    className={styles.commuteGroupItem()}
                />
            )}
        </div>
    );
};

export default CommuteGroup;
