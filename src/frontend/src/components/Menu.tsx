import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import Button from "./base/Button/Button";
import { NavTab } from "./base/NavTab/NavTab";
import {
    Dropdown,
    DropdownItem,
    DropdownTrigger,
} from "./base/Dropdown/Dropdown";
import useMediaQuery from "hooks/useMediaQuery";

import EchoTextLogo from "assets/icons/echo-logo-text.svg?react";
import EchoLogo from "assets/icons/echo-logo.svg?react";
import HamburgerIcon from "assets/icons/hamburger.svg?react";
import ArrowDownIcon from "assets/icons/arrow-down.svg?react";

interface Props {
    compareCount: number;
}

const Menu = ({ compareCount }: Props) => {
    const [activeLink, setActiveLink] = useState<string | null>(null);
    // TODO: hook up with app-wide language state
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const { pathname } = useLocation();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const languages: { [key: string]: string } = {
        en: "EN",
        es: "ES",
        zh: "中文",
    };

    useEffect(() => {
        if (pathname.includes("compare")) {
            setActiveLink("compare");
        }
        if (pathname.includes("discover")) {
            setActiveLink("discover");
        }
    }, [pathname]);

    return (
        <div className="flex w-full h-9 justify-between items-center gap-5 self-stretch flex-shrink-0 py-0 pl-4 pr-3">
            {/* The ECHO icon section */}
            <div className="flex items-center gap-0 flex-1 pt-2 pb-3 pl-0">
                {isDesktop ? (
                    <EchoTextLogo className="h-[18px]" />
                ) : (
                    <EchoLogo className="h-[18px] w-[19px]" />
                )}
            </div>

            {/* The Discover/Compare section */}
            {activeLink && (
                <div className="flex items-center justify-center gap-0 flex-1  pb-3 pl-0">
                    <NavTab
                        href="/discover"
                        isActive={activeLink === "discover"}
                    >
                        Discover
                    </NavTab>
                    <NavTab
                        href="/compare"
                        isActive={activeLink === "compare"}
                        count={compareCount}
                        badgeVariant={compareCount > 0 ? "orange" : "primary"}
                    >
                        Compare
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
                                className="text-teal-900"
                                rightIcon={
                                    <ArrowDownIcon className="font-normal h-[14px] w-[14px] fill fill-teal-900" />
                                }
                            >
                                {languages[selectedLanguage]}
                            </Button>
                            <Dropdown
                                onAction={key =>
                                    setSelectedLanguage(key as string)
                                }
                            >
                                <DropdownItem id="en">EN</DropdownItem>
                                <DropdownItem id="es">ES</DropdownItem>
                                <DropdownItem id="zh">中文</DropdownItem>
                            </Dropdown>
                        </DropdownTrigger>
                        <Button variant="ghost" className="text-teal-900">
                            Logout
                        </Button>
                    </>
                ) : (
                    // TODO: Implement the hamburger menu, pending design
                    <Button
                        variant="ghost"
                        leftIcon={
                            <HamburgerIcon className="fill fill-teal-900 text-sm h-5 w-5 font-normal" />
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default Menu;
