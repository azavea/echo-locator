export type NetworkModeOptions =
    | "peak"
    | "off-peak"
    | "peak-no-express"
    | "off-peak-no-express"
    | "car";

export type Networks = {
    [key in NetworkModeOptions]: any;
};

export interface NetworksSliceState {
    networks: Networks | null;
    origin: [number, number] | null;
    activeMode: NetworkModeOptions;
    loading: boolean;
    error: string | null;
}
