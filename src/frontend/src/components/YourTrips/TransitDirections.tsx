import type { Destination } from "src/reducers/userProfile/types";
import { useGetDestinationToNeighborhoodPath } from "src/hooks/useGetDestinationToNeighborhoodSegments";

const TransitDirections = ({
    start,
    end,
}: {
    start: Destination;
    end: string;
}) => {
    const transitPath = useGetDestinationToNeighborhoodPath(start, end);

    const validTransitSegments = transitPath.filter(
        s => s.mode && s.name && s.routeColor
    );
    return (
        <div className="flex flex-row items-center">
            {validTransitSegments.map(segment => {
                return (
                    <>
                        <div
                            style={{
                                backgroundColor: segment.routeColor,
                            }}
                        >
                            {segment.name}
                        </div>
                    </>
                );
            })}
        </div>
    );
};

export default TransitDirections;
