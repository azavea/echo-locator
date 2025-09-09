import axios from "axios";
import { NetworkModeOptions, type NetworkModeOptionKey } from "src/enums";

export const fetchNetworkData = async (
    network: NetworkModeOptionKey
): Promise<any> => {
    console.log('test network url at fetchNetworkData:', import.meta.env.VITE_NETWORK_URL_ROOT)
    console.log('test token at fetchNetworkData:', import.meta.env.VITE_AUTHTOKEN)
    const [requestResponse, transitiveResponse] = await Promise.all([
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptions[network]}/request.json`
        ),
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptions[network]}/transitive.json`
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
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptions[network]}/${index}_times.dat`
    );
};

export const fetchPathsData = async (
    network: NetworkModeOptionKey,
    index: number
): Promise<any> => {
    return fetchBinaryData(
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${NetworkModeOptions[network]}/${index}_paths.dat`
    );
};
