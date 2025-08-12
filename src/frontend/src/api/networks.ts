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
