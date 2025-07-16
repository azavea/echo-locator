import { useState } from "react";

import Slider from "./base/Slider/Slider";

const Factor = {
    Commute: "commute",
    School: "school",
    Safety: "safety",
};

type FactorKeys = (typeof Factor)[keyof typeof Factor];

type FactorType = { [key: FactorKeys]: number };

const importance: FactorType = {
    commute: 1,
    school: 2,
    safety: 3,
};

const ImportanceSliders = () => {
    const [factor, setFactor] = useState<FactorType>({ ...importance });

    const onChange = (value: number | number[], factor: FactorKeys) => {
        // base on React Aria, value is of type number | number[],
        // in reality we only pass number to value,
        // adding the following line to make TypeScript happy,
        if (Array.isArray(value)) return;
        setFactor(state => ({ ...state, [factor]: value }));
    };

    return (
        <div className="flex flex-col gap-8">
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label="Commute time"
                value={factor.commute}
                onChange={value => onChange(value, Factor.Commute)}
            />
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label="School Quality"
                value={factor.school}
                onChange={value => onChange(value, Factor.School)}
            />
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label="Public safety"
                value={factor.safety}
                onChange={value => onChange(value, Factor.Safety)}
            />
        </div>
    );
};

export default ImportanceSliders;
