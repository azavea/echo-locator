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
                        className={`${legendColorBox()} bg-[#BCD168] border-1 border-[#748C27]`}
                    />
                    <span className={legendLabel()}>Top 10</span>
                </div>
                <div className={legendItem()}>
                    <div
                        className={`${legendColorBox()} bg-[#D6DFA6] border-1 border-[#8BA045]`}
                    />
                    <span className={legendLabel()}>Recommended</span>
                </div>
                <div className={legendItem()}>
                    <div
                        className={`${legendColorBox()} bg-[#F7F3F1] border-1 border-[#868584]`}
                    />
                    <span className={`${legendLabel()} font-normal`}>
                        Too far
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Legend;
