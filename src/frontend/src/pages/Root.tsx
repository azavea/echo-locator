import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";

import Menu from "components/Menu";
import { SUPPORTED_LANGUAGES } from "components/LanguageRedirect";
import { Language, type LanguageKey } from "src/enums";
import { languageToLabel } from "src/constants";

const Root = () => {
    const { lang } = useParams<{ lang: LanguageKey }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    // Sync the i18n language state with the URL lang param
    // 1. If no language or language isn't in the allowed list, use English;
    // 2. If the URL language isn't the same as i18n language, change to URL language
    useEffect(() => {
        if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
            i18n.changeLanguage(Language.EN);
            const currentPath = location.pathname.split("/").slice(2).join("/");
            navigate(`/${Language.EN}/${currentPath || "discover"}`);
            return;
        }
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n, location]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* TODO: get compareCount from app store */}
            <Menu compareCount={0} languages={languageToLabel} />
            <div className="flex flex-1 flex-col items-center self-stretch gap-6 rounded-t-[16px] bg-white px-10 py-16">
                <Outlet />
            </div>
        </div>
    );
};

export default Root;
