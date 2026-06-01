import type { UnitSitesKeyType } from "src/enums";
import type { Destination } from "src/reducers/userProfile/types";

const URLsBySite = {
    craigslist: (room: number, max_rent: number, zipcode: string) =>
        `https://boston.craigslist.org/search/apa?max_bedrooms=${room}&max_price=${max_rent}&min_bedrooms=${room}&postal=${zipcode}`,
    zillow: (room: number, max_rent: number, zipcode: string) =>
        `https://www.zillow.com/homes/for_rent/${zipcode}_rb/0-${max_rent}_mp/${room}-_beds/`,
    ah: (room: number, max_rent: number, zipcode: string) =>
        `https://www.affordablehousing.com/boston-ma-${zipcode}/under-${max_rent}/${room}-bed/`,
};

export const getUnitsURL = (
    site: UnitSitesKeyType,
    zipcode: string,
    room: number,
    max_rent: number
): string => URLsBySite[site](room, max_rent, zipcode);

export const createGoogleDirectionsURL = (
    neighborhood: string,
    destination: Destination,
    isTripToNeighborhood: boolean,
    isTransit: boolean
) => {
    const destinationSubString = `${destination.location.position.lat},${destination.location.position.lon}`;
    return `https://www.google.com/maps/dir/?api=1&travelmode=${isTransit ? "transit" : "car"}&origin=${isTripToNeighborhood ? destinationSubString : neighborhood}&destination=${isTripToNeighborhood ? neighborhood : destinationSubString}`;
};
