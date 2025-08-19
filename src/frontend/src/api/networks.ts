import axios from "axios";

export const fetchNetworkData = async (network: string): Promise<any> => {
    const [requestResponse, transitiveResponse] = await Promise.all([
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${network}/request.json`
        ),
        axios.get(
            `${import.meta.env.VITE_NETWORK_URL_ROOT}/${network}/transitive.json`
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
    network: string,
    index: number
): Promise<any> => {
    return fetchBinaryData(
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${network}/${index}_times.dat`
    );
};

export const fetchPathsData = async (
    network: string,
    index: number
): Promise<any> => {
    return fetchBinaryData(
        `${import.meta.env.VITE_NETWORK_URL_ROOT}/${network}/${index}_paths.dat`
    );
};
