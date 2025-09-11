import mapStyles from "./Map.styles";

interface Props {
    isMobile?: boolean;
}

const Legend = ({ isMobile = true }: Props) => {
    const {
        legendWrapper,
        legendContainer,
        legendItem,
        legendColorBox,
        legendLabel,
    } = mapStyles({ isMobile });

    return (
        <div className={legendWrapper()}>
            <div className={legendContainer()}>
                <div className={legendItem()}>
                    <div
                        className={`${legendColorBox()} bg-[#B9C26D] border-1 border-[#748C27]`}
                    />
                    <span className={legendLabel()}>Top 10</span>
                </div>
                <div className={legendItem()}>
                    <div
                        className={`${legendColorBox()} bg-[#E6ECBB] border-1 border-[#909772]`}
                    />
                    <span className={`${legendLabel()} font-normal`}>
                        Other
                    </span>
                </div>
                <div className={legendItem()}>
                    <div
                        className={`${legendColorBox()} bg-[#F7F3F1] border-1 border-[#8F8F8F]`}
                    />
                    <span className={`${legendLabel()} font-normal`}>
                        Not a match
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Legend;
