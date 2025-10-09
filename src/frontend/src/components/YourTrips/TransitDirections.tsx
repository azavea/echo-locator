import type { Destination } from "src/reducers/userProfile/types";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";
import BusIcon from "assets/icons/bus.svg?react";
import SubwayTrainIcon from "assets/icons/train-subway.svg?react";
import { useGetDestinationToNeighborhoodPath } from "src/hooks/useGetDestinationToNeighborhoodSegments";
import { Fragment } from "react/jsx-runtime";

// Uses the routeColor generated from Taui for transit line and creates an
// rgba equivalent that can be adjusted lighter or darker for our UI use.
// Darker color is used for directions text and light used for directions bg.
const hexToRgba = (hex: string | undefined, adjust?: "darker" | "lighter") => {
    if (!hex) {
        return `rgba("255", "255", "255")`;
    }
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    // Parse the R, G, and B components
    let r = parseInt(cleanHex.substring(0, 2), 16);
    let g = parseInt(cleanHex.substring(2, 4), 16);
    let b = parseInt(cleanHex.substring(4, 6), 16);

    if (adjust) {
        const adjustToNum = adjust === "darker" ? -0.5 : 0.5;
        const clamp = (value: number) => Math.max(0, Math.min(255, value));

        r = clamp(r + adjustToNum * (adjustToNum > 0 ? 255 - r : r));
        g = clamp(g + adjustToNum * (adjustToNum > 0 ? 255 - g : g));
        b = clamp(b + adjustToNum * (adjustToNum > 0 ? 255 - b : b));

        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
    }

    return `rgba(${r}, ${g}, ${b})`;
};

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
        <div className="flex flex-row items-center flex-wrap">
            {validTransitSegments.map((segment, index) => {
                const lightTransitColor = hexToRgba(
                    segment.routeColor,
                    "lighter"
                );
                const darkTransitColor = hexToRgba(
                    segment.routeColor,
                    "darker"
                );
                return (
                    <Fragment key={index}>
                        <div
                            style={{
                                backgroundColor: lightTransitColor,
                                color: darkTransitColor,
                            }}
                            className="flex items-center py-0.25 px-3 gap-3 border border-white shadow-sm font-extrabold text-md !rounded-sm"
                        >
                            <div>
                                {(segment.mode === "subway" ||
                                    segment.mode === "train") && (
                                    <SubwayTrainIcon
                                        style={{ fill: darkTransitColor }}
                                    />
                                )}
                                {segment.mode === "bus" && (
                                    <BusIcon
                                        style={{ fill: darkTransitColor }}
                                    />
                                )}
                            </div>
                            {segment.name}
                        </div>
                        {index < validTransitSegments.length - 1 && (
                            <ArrowRightIcon className="font-normal h-[14px] w-[14px] fill fill-gray-500" />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
};

export default TransitDirections;
