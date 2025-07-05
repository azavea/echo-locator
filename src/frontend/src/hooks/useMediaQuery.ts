import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
    window.addEventListener("resize", callback);
    return () => {
        window.removeEventListener("resize", callback);
    };
};

const getSnapshot = (query: string) => {
    if (typeof window !== "undefined") {
        return window.matchMedia(query).matches;
    }
    return false;
};

const useMediaQuery = (query: string): boolean => {
    // The server snapshot should match the initial client snapshot
    const getServerSnapshot = () => false;

    // A getter function to memoize the snapshot
    const getSnapshotMemo = () => getSnapshot(query);

    return useSyncExternalStore(subscribe, getSnapshotMemo, getServerSnapshot);
};

export default useMediaQuery;
