import { useEffect } from "react";
import { useNavigate } from "react-router";

import { Language } from "src/enums";
import useSupportedLanguage from "hooks/useSupportedLanguage";

export const SUPPORTED_LANGUAGES = [Language.EN, Language.ES, Language.ZH];

const LanguageRedirect = ({ to }: { to: string }) => {
    const navigate = useNavigate();
    const language = useSupportedLanguage();

    useEffect(() => {
        navigate(`/${language}/${to}`, { replace: true });
    }, [navigate, to, language]);

    return null;
};

export default LanguageRedirect;
