import {
    Slider as AriaSlider,
    SliderThumb,
    SliderTrack,
    Label,
    type SliderProps as AriaSliderProps,
} from "react-aria-components";

import { sliderStyles } from "./Slider.styles";

interface SliderProps extends AriaSliderProps {
    minValue: number;
    maxValue: number;
    step: number;
    label?: string;
    minValLabel?: string;
    maxValLabel?: string;
}

const Slider = (props: SliderProps) => {
    const {
        root,
        label: labelStyle,
        track,
        fill,
        thumb,
        ticksContainer,
        tick,
        endpointLabelsContainer,
        endpointLabel,
    } = sliderStyles({ isFocusVisible: false });

    const { label, minValue, maxValue, step, minValLabel, maxValLabel } = props;

    const numSteps = (maxValue - minValue) / step;

    return (
        <AriaSlider {...props} className={root()}>
            <Label className={labelStyle()}>{label}</Label>
            <div className="px-6">
                <SliderTrack className={track()}>
                    {({ state }) => (
                        <div>
                            <div
                                className={fill()}
                                style={{
                                    width: state.getThumbPercent(0) * 100 + "%",
                                }}
                            />
                            <div className={ticksContainer()}>
                                {Array.from(
                                    { length: numSteps - 1 },
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className={tick()}
                                            style={{
                                                left: `${((i + 1) / numSteps) * 100}%`,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                            <SliderThumb
                                className={({ isFocusVisible }) =>
                                    thumb({ isFocusVisible })
                                }
                            />
                        </div>
                    )}
                </SliderTrack>
            </div>
            <div className={endpointLabelsContainer()}>
                <div className={endpointLabel()}>{minValLabel}</div>
                <div className={endpointLabel()}>{maxValLabel}</div>
            </div>
        </AriaSlider>
    );
};

export default Slider;
