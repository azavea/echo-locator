import { useEffect, useState } from "react";

import {
    RadioButton,
    RadioButtonGroup,
} from "./base/RadioButtonGroup/RadioButtonGroup";

export const Languages = {
    EN: "en",
    ES: "es",
    ZH: "zh",
};

type LanguageKeys = (typeof Languages)[keyof typeof Languages];

interface Props {
    language: LanguageKeys;
}

const SelectLanguageButtons = ({ language }: Props) => {
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageKeys>(language);

    useEffect(() => {
        setSelectedLanguage(language);
    }, [language]);

    return (
        <RadioButtonGroup
            aria-label="Select a language"
            value={selectedLanguage}
            onChange={setSelectedLanguage}
        >
            <RadioButton value={Languages.EN}>English</RadioButton>
            <RadioButton value={Languages.ES}>Español</RadioButton>
            <RadioButton value={Languages.ZH}>中文</RadioButton>
        </RadioButtonGroup>
    );
};

export default SelectLanguageButtons;
