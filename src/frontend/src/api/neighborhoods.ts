import type {
    NeighborhoodBounds,
    Neighborhoods,
} from "reducers/neighborhoods/types";
import apiClient from "./client";

export const fetchNeighborhoods = async (): Promise<Neighborhoods> => {
    const response = await apiClient.get<Neighborhoods>("/neighborhoods/");
    return response.data;
};

export const fetchNeighborhoodBounds =
    async (): Promise<NeighborhoodBounds> => {
        const response = await apiClient.get<NeighborhoodBounds>(
            "/neighborhood-bounds/"
        );
        return response.data;
    };
