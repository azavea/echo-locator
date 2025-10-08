import axios from "axios";
import { NetworkModeOptionPaths, type NetworkModeOptionKey } from "src/enums";

export const fetchNetworkData = async (
    network: NetworkModeOptionKey
): Promise<any> => {
    const [requestResponse, transitiveResponse] = await Promise.all([
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptionPaths[network]}/request.json`
        ),
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptionPaths[network]}/transitive.json`
        ),
    ]);
    return [requestResponse, transitiveResponse];
};

const fetchBinaryData = async (url: string) => {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });
        return { value: response.data };
    } catch (error) {
        throw error;
    }
};

export const fetchTimesData = async (
    network: NetworkModeOptionKey,
    index: number
): Promise<any> => {
    return fetchBinaryData(
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptionPaths[network]}/${index}_times.dat`
    );
};

export const fetchPathsData = async (
    network: NetworkModeOptionKey,
    index: number
): Promise<any> => {
    return fetchBinaryData(
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptionPaths[network]}/${index}_paths.dat`
    );
};
