import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Dialog } from "react-aria-components";
import { useTranslation, Trans } from "react-i18next";

import { Language, type LanguageKey } from "src/enums";
import useMediaQuery from "hooks/useMediaQuery";
import Button from "components/base/Button/Button";
import SelectLanguageButtons from "components/SelectLanguageButtons";
import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import InputText from "components/InputText";
import { login } from "api/auth";
import EchoTextLogo from "assets/icons/echo-logo-text.svg?react";
import NeighborhoodImage from "assets/icons/neighborhood.svg?react";
import MailImage from "assets/icons/mail.svg?react";
import loginInStyles from "./Login.styles";
import type { RootState } from "store/store";

const BHA_URL =
    import.meta.env.VITE_BHA_ECHO_PROGRAM_URL ||
    "https://www.bostonhousing.org/en/Home-New.aspx";

const Login = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);

    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        root,
        content,
        captionContainer,
        caption,
        modalContainer,
        modalTitle,
        mailImageContainer,
        modalErrorText,
    } = loginInStyles({
        isMobile: !isDesktop,
    });

    useEffect(() => {
        if (!!token) navigate(`/${lang}/discover`, { replace: true });
    }, [token]);

    const onClickLogin = async () => {
        try {
            setHasError(false);
            await login(email);
            setIsEmailSent(true);
        } catch (err) {
            console.error(err);
            setHasError(true);
        }
    };

    const onChangeEmail = (value: string) => {
        setHasError(false);
        setEmail(value);
    };

    return (
        <div className={root()}>
            <SelectLanguageButtons language={lang || Language.EN} />
            <div className={content()}>
                {!isDesktop && <EchoTextLogo className="h-[32.4px]" />}
                <NeighborhoodImage />
                <div className={captionContainer()}>
                    <p className={caption()}>
                        {t("signInPage.signInPageCaption")}
                    </p>
                </div>
            </div>
            <Button
                variant="primary"
                size="large"
                className={isDesktop ? "" : "w-full"}
                onPress={() => setIsOpen(true)}
            >
                {t("signInPage.signIn")}
            </Button>
            <ModalOverlay
                isDismissable
                isMobile={!isDesktop}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            >
                <Modal size={isDesktop ? "medium" : "small"}>
                    <Dialog aria-label="Sign in with email">
                        <div className={modalContainer()}>
                            {!isEmailSent ? (
                                <>
                                    <p className={modalTitle()}>
                                        {t("signInPage.signInWithEmail")}
                                    </p>
                                    <p>
                                        <Trans
                                            i18nKey="signInPage.signInModalSubtitle"
                                            components={[
                                                <a
                                                    href={BHA_URL}
                                                    target="_blank"
                                                />,
                                            ]}
                                        />
                                    </p>
                                    <InputText
                                        label="Email address"
                                        size="large"
                                        placeholder={t(
                                            "signInPage.enterEmailAddress"
                                        )}
                                        value={email}
                                        onChange={onChangeEmail}
                                    />
                                    {hasError && !!email.length && (
                                        <p className={modalErrorText()}>
                                            {t(
                                                "signInPage.emailAddressInvalid"
                                            )}
                                        </p>
                                    )}
                                    <Button
                                        variant="primary"
                                        size="large"
                                        className="w-full"
                                        isDisabled={!email.length || hasError}
                                        onPress={onClickLogin}
                                    >
                                        {t("signInPage.signIn")}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className={mailImageContainer()}>
                                        <MailImage />
                                    </div>

                                    <p className={modalTitle()}>
                                        {t("signInPage.checkYourEmail")}
                                    </p>
                                    <p>
                                        {t("signInPage.signInConfirm", {
                                            email,
                                        })}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="large"
                                        className="w-full"
                                        onPress={() => setIsOpen(false)}
                                    >
                                        {t("signInPage.goBack")}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    );
};

export default Login;
