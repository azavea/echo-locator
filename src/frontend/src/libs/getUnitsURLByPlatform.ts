import type { UnitSitesKeyType } from "src/enums";

const URLsBySite = {
    craigslist: (room: number, max_rent: number, zipcode: string) =>
        `https://boston.craigslist.org/search/apa?max_bedrooms=${room}&max_price=${max_rent}&min_bedrooms=${room}&postal=${zipcode}`,
    zillow: (room: number, max_rent: number, zipcode: string) =>
        `https://www.zillow.com/homes/for_rent/${zipcode}_rb/0-${max_rent}_mp/${room}-_beds/`,
    ah: (room: number, max_rent: number, zipcode: string) =>
        `https://www.affordablehousing.com/boston-ma-${zipcode}/under-${max_rent}/${room}-bed/`,
};

const getUnitsURL = (
    site: UnitSitesKeyType,
    zipcode: string,
    room: number,
    max_rent: number
): string => URLsBySite[site](room, max_rent, zipcode);

export default getUnitsURL;
