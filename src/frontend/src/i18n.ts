import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n.use(HttpApi) // Loads translations from /public/locales folder
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n instance to react-i18next
    .init({
        supportedLngs: ["en", "es", "zh"],
        fallbackLng: "en",
        debug: !import.meta.env.PROD, // Debug mode only when in non-production
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },
        detection: {
            order: ["path", "localStorage", "navigator", "htmlTag"],
            lookupFromPathIndex: 0,
        },
    });

export default i18n;
