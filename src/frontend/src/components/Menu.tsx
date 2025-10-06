import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Dialog } from "react-aria-components";

import Button from "./base/Button/Button";
import NavTab from "./base/NavTab/NavTab";
import {
    Dropdown,
    DropdownItem,
    DropdownTrigger,
} from "./base/Dropdown/Dropdown";
import useMediaQuery from "hooks/useMediaQuery";
import getPathByLang from "libs/getPathByLang";
import { Language, type LanguageKey } from "src/enums";
import { Modal, ModalOverlay } from "./base/Modal/Modal";
import SelectLanguageButtons from "./SelectLanguageButtons";

import EchoTextLogo from "assets/icons/echo-logo-text.svg?react";
import EchoLogo from "assets/icons/echo-logo.svg?react";
import HamburgerIcon from "assets/icons/hamburger.svg?react";
import ArrowDownIcon from "assets/icons/arrow-down.svg?react";
import type { RootState } from "store/store";

interface Props {
    languages: { [key: LanguageKey]: string };
    compareCount: number;
}

const Menu = ({ languages, compareCount }: Props) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [isOpen, setIsOpen] = useState(false);

    const onChangeLanguage = (key: React.Key) => {
        navigate(getPathByLang(key as string, location.pathname));
    };

    const onLogout = () => {
        setIsOpen(false);
        navigate("/logout");
    };

    return (
        <div className="flex w-full h-9 justify-between items-center gap-5 self-stretch flex-shrink-0 py-0 pl-4 pr-3">
            {/* The ECHO icon section */}
            <div className="flex items-center gap-0 flex-1 pt-2 pb-3 pl-3">
                {isDesktop ? (
                    <EchoTextLogo className="h-[19px]" />
                ) : (
                    <EchoLogo className="h-[19px] w-[20px]" />
                )}
            </div>

            {/* The Discover/Compare section */}
            {(location.pathname.includes("discover") ||
                location.pathname.includes("compare")) && (
                <div className="flex self-stretch justify-center gap-2">
                    <NavTab
                        to={`/${lang}/discover`}
                        isActive={location.pathname.includes("discover")}
                    >
                        {t("discover")}
                    </NavTab>
                    <NavTab
                        to={`/${lang}/compare`}
                        isActive={location.pathname.includes("compare")}
                        count={compareCount}
                        badgeVariant={compareCount > 0 ? "orange" : "primary"}
                    >
                        {t("compare")}
                    </NavTab>
                </div>
            )}

            {/* The dropdown/button section */}
            <div className="flex flex-1 items-center justify-end">
                {isDesktop ? (
                    <>
                        <DropdownTrigger>
                            <Button
                                variant="ghost"
                                className="text-teal-900 gap-2"
                                rightIcon={
                                    <ArrowDownIcon className="font-normal h-[13px] w-[13px] fill fill-teal-800" />
                                }
                            >
                                {languages[i18n.language]}
                            </Button>
                            <Dropdown onAction={onChangeLanguage}>
                                <DropdownItem id={Language.EN}>
                                    {languages.en}
                                </DropdownItem>
                                <DropdownItem id={Language.ES}>
                                    {languages.es}
                                </DropdownItem>
                                <DropdownItem id={Language.ZH}>
                                    {languages.zh}
                                </DropdownItem>
                            </Dropdown>
                        </DropdownTrigger>
                        {token && (
                            <Button
                                variant="ghost"
                                className="text-teal-900"
                                onPress={onLogout}
                            >
                                {t("logout")}
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            leftIcon={
                                <HamburgerIcon className="fill fill-teal-900 text-sm h-5 w-5 font-normal" />
                            }
                            onPress={() => setIsOpen(true)}
                        />
                        <ModalOverlay
                            isDismissable
                            isMobile
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <Modal size="small">
                                <Dialog aria-label="Menu">
                                    <div className="flex flex-col p-5 align-middle">
                                        <SelectLanguageButtons
                                            language={lang || Language.EN}
                                            callback={() => setIsOpen(false)}
                                        />
                                    </div>
                                    {token && (
                                        <>
                                            <div className="w-full h-px bg-gray-300"></div>
                                            <div className="flex flex-col p-5 align-middle">
                                                <Button
                                                    variant="outline"
                                                    className="normal-case text-teal-800"
                                                    onPress={onLogout}
                                                >
                                                    {t("logout")}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Dialog>
                            </Modal>
                        </ModalOverlay>
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;
