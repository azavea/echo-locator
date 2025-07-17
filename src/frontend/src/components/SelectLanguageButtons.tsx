import { useLocation, useNavigate } from "react-router";

import {
    RadioButton,
    RadioButtonGroup,
} from "./base/RadioButtonGroup/RadioButtonGroup";
import getPathByLang from "libs/getPathByLang";
import { Language, type LanguageKey } from "src/enums";
import { languageToLabel } from "src/constants";

interface Props {
    language: LanguageKey;
    callback?: () => void;
}

const SelectLanguageButtons = ({ language, callback = () => {} }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const onChangeLanguage = (key: React.Key) => {
        navigate(getPathByLang(key as string, location.pathname));
        callback();
    };

    return (
        <RadioButtonGroup
            aria-label="Select a language"
            value={language}
            onChange={onChangeLanguage}
        >
            <RadioButton value={Language.EN}>
                {languageToLabel[Language.EN]}
            </RadioButton>
            <RadioButton value={Language.ES}>
                {languageToLabel[Language.ES]}
            </RadioButton>
            <RadioButton value={Language.ZH}>
                {languageToLabel[Language.ZH]}
            </RadioButton>
        </RadioButtonGroup>
    );
};

export default SelectLanguageButtons;
