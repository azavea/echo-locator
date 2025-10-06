import { Link, Focusable } from "react-aria-components";

interface LicensedImageProps {
    image: string;
    description: string;
    artist: string;
    licenseLink: string;
    license: string;
    sourceLink: string;
}

export const LicensedImage = ({
    image,
    description,
    artist,
    licenseLink,
    license,
    sourceLink,
}: LicensedImageProps) =>
    image && (
        <figure>
            <Focusable>
                <img
                    src={image}
                    alt={description}
                    tabIndex={0}
                    className="relative max-w-[272px] max-h-[153px] shrink-0 aspect-[16/9] rounded-[8px] object-cover bg-gray-200 [box-shadow:0_-1px_2px_0_rgba(0,0,0,0.05),0_6px_2px_0_rgba(0,0,0,0),0_4px_1px_0_rgba(0,0,0,0.01),0_2px_1px_0_rgba(0,0,0,0.05),0_1px_1px_0_rgba(0,0,0,0.09)]"
                />
            </Focusable>
            <figcaption className="mt-2 text-gray-600">
                <p className="text-[10px]">
                    Photo by {artist}. Licensed under{" "}
                    <Link
                        href={licenseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {license}
                    </Link>
                    .{" "}
                    <Link
                        href={sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Source.
                    </Link>
                </p>
            </figcaption>
        </figure>
    );
