const DestinationMarker = ({ isDefault = true }: { isDefault: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="31"
        viewBox="0 0 22 31"
        fill="none"
    >
        <g filter="url(#filter0_dddd_1373_3025)">
            <path
                d="M19 12C19 18 11 25 11 25C11 25 3 18 3 12C3 9.87827 3.84285 7.84344 5.34315 6.34315C6.84344 4.84285 8.87827 4 11 4C13.1217 4 15.1566 4.84285 16.6569 6.34315C18.1571 7.84344 19 9.87827 19 12Z"
                fill={isDefault ? "#02B3CC" : "#DAE9EB"}
            />
            <path
                d="M19 12C19 18 11 25 11 25C11 25 3 18 3 12C3 9.87827 3.84285 7.84344 5.34315 6.34315C6.84344 4.84285 8.87827 4 11 4C13.1217 4 15.1566 4.84285 16.6569 6.34315C18.1571 7.84344 19 9.87827 19 12Z"
                stroke="white"
                stroke-width="1.5"
                stroke-miterlimit="10"
            />
        </g>
        <defs>
            <filter
                id="filter0_dddd_1373_3025"
                x="0.25"
                y="0.25"
                width="21.5"
                height="30.7461"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                />
                <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_1373_3025"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                />
                <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_1373_3025"
                    result="effect2_dropShadow_1373_3025"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
                />
                <feBlend
                    mode="normal"
                    in2="effect2_dropShadow_1373_3025"
                    result="effect3_dropShadow_1373_3025"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy="-1" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                />
                <feBlend
                    mode="normal"
                    in2="effect3_dropShadow_1373_3025"
                    result="effect4_dropShadow_1373_3025"
                />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect4_dropShadow_1373_3025"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
);

export default DestinationMarker;
