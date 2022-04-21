// @flow
import { withTranslation } from "react-i18next";
import React from "react";
import { Link } from "react-router-dom";

import type { AccountProfile } from "../types";
import logo from "../img/echo_combined_logo_fullcolor.svg";

class CustomHeaderBar extends React.Component {
  render() {
    const { t, i18n } = this.props;
    const userProfile: AccountProfile = this.props.userProfile || this.state.userProfile;
    if (!userProfile) {
      return null;
    }

    const userInfo = userProfile ? (
      <div className="app-header__user-info">
        <span className="app-header__button">
          <Link to={{ pathname: "/profile", state: { fromApp: true } }}>{t("Header.Edit")}</Link>
        </span>
      </div>
    ) : null;

    return (
      <header className="app-header">
        <div className="app-header__brand">
          <img className="app-header__logo" src={logo} alt={t("Title")} />
        </div>
        {userInfo}
        <div className="app-header__languageSelect">
          <button
            className={`app-header__button ${
              i18n.language === "en" ? "app-header__button--on" : ""
            }`}
            onClick={() => i18n.changeLanguage("en")}
          >
            English
          </button>
          <button
            className={`app-header__button ${
              i18n.language === "es" ? "app-header__button--on" : ""
            }`}
            onClick={() => i18n.changeLanguage("es")}
          >
            Español
          </button>
          <button
            className={`app-header__button ${
              i18n.language === "zh" ? "app-header__button--on" : ""
            }`}
            onClick={() => i18n.changeLanguage("zh")}
          >
            中文
          </button>
        </div>
      </header>
    );
  }
}

export default withTranslation()(CustomHeaderBar);
