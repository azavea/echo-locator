import { useTranslation } from "react-i18next";
import { Language } from "src/enums";

export const SUPPORTED_LANGUAGES = [Language.EN, Language.ES, Language.ZH];

// Check if the current i18n language is supported;
// Otherwise, use English.
const useSupportedLanguage = (): string => {
    const { i18n } = useTranslation();
    const isSupported = SUPPORTED_LANGUAGES.includes(i18n.language);
    return isSupported ? i18n.language : Language.EN;
};

export default useSupportedLanguage;
