import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";

import { SUPPORTED_LANGUAGES } from "components/LanguageRedirect";
import Menu from "components/Menu";
import { languageToLabel } from "src/constants";
import { Language, type LanguageKey } from "src/enums";
import { selectFavoritesCount } from "src/reducers/userProfile/userSlice";
import { useAppSelector } from "src/store/store";

const Root = () => {
    const { lang } = useParams<{ lang: LanguageKey }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const favoritesCount = useAppSelector(selectFavoritesCount);

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
        <div className="h-dvh flex flex-col">
            <Menu compareCount={favoritesCount} languages={languageToLabel} />
            <Outlet />
        </div>
    );
};

export default Root;
