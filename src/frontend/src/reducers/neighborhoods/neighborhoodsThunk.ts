import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchNeighborhoods,
    fetchNeighborhoodBounds,
} from "../../api/neighborhoods";

export const getNeighborhoodsAndBounds = createAsyncThunk(
    "neighborhoods/getNeighborhoodsAndBounds",
    async (authToken: string | null) => {
        if (!authToken) {
            throw new Error("Authentication token not found");
        }

        const [neighborhoods, neighborhoodBounds] = await Promise.all([
            fetchNeighborhoods(authToken),
            fetchNeighborhoodBounds(authToken),
        ]);

        return { neighborhoods, neighborhoodBounds };
    }
);
