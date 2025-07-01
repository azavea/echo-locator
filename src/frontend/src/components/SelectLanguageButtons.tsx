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
            value={selectedLanguage}
            onChange={setSelectedLanguage}
        >
            <RadioButton value={Languages.EN} label="English" />
            <RadioButton value={Languages.ES} label="Español" />
            <RadioButton value={Languages.ZH} label="中文" />
        </RadioButtonGroup>
    );
};

export default SelectLanguageButtons;
