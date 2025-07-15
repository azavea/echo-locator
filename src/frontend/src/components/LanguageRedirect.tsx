import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Language } from "src/enums";

export const SUPPORTED_LANGUAGES = [Language.EN, Language.ES, Language.ZH];

const LanguageRedirect = ({ to }: { to: string }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    // 1. Check if the current i18n language is supported;
    //    Otherwise, use English.
    // 2. Then, navigate to the correct path with language prefix,
    //    replacing the history
    useEffect(() => {
        const lang = SUPPORTED_LANGUAGES.includes(i18n.language)
            ? i18n.language
            : Language.EN;

        navigate(`/${lang}/${to}`, { replace: true });
    }, [i18n, navigate, to]);

    return null;
};

export default LanguageRedirect;
