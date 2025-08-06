import axios from "axios";
import type {
    NeighborhoodBounds,
    Neighborhoods,
} from "reducers/neighborhoods/types";

const API_BASE_URL = "/api";

export const fetchNeighborhoods = async (
    authToken: string
): Promise<Neighborhoods> => {
    const response = await axios.get<Neighborhoods>(
        `${API_BASE_URL}/neighborhoods/`,
        {
            headers: { Authorization: `Token ${authToken}` },
        }
    );
    return response.data;
};

export const fetchNeighborhoodBounds = async (
    authToken: string
): Promise<NeighborhoodBounds> => {
    const response = await axios.get<NeighborhoodBounds>(
        `${API_BASE_URL}/neighborhood-bounds/`,
        {
            headers: { Authorization: `Token ${authToken}` },
        }
    );
    return response.data;
};
