// @flow
import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import logo from "../img/echo_combined_logo_STACKED_fullcolor.svg";

class SignInHeader extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <header className="auth-screen__header auth-header">
        <h2 className="auth-header__agency">{t("Agency")}</h2>
        <h1 className="auth-header__app-name">
          <img className="auth-header__logo" src={logo} alt={t("Title")} />
        </h1>
        <p className="auth-header__greeting">{t("SignIn.Greeting")}</p>
      </header>
    );
  }
}

const SignInHeaderTranslated = withTranslation()(SignInHeader);

class CustomSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", newUser: false };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleToggle(e) {
    const toggle = !e.target.className.includes("login");
    this.setState({ newUser: toggle });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.state.newUser
      ? this.props.sendSignUpLink(this.state.value)
      : this.props.sendLoginLink(this.state.value);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="auth-screen">
        <SignInHeaderTranslated />
        <div className="auth-screen__main auth-main">
          <form onSubmit={this.handleSubmit}>
            <fieldset>
              <label>
                <p>{t("Profile.ClientEmailLabel")}</p>
                <input name="email" value={this.state.value} onChange={this.handleChange} />
              </label>
            </fieldset>
            <button type="submit" className="auth-main__button auth-main__button--primary">
              {this.state.newUser ? t("Header.SignUp") : t("Header.SignIn")}
            </button>
            <div className="auth-main__success-message">{t(this.props.data.loginMessage)}</div>
          </form>
          {this.state.newUser ? (
            <div className="auth-main__new-user-toggle">
              {`${t("SignIn.SwitchToLoginExplanation")} `}
              <span className="login link" onClick={this.handleToggle}>
                {t("SignIn.SwitchToLogin")}
              </span>
            </div>
          ) : (
            <div className="auth-main__new-user-toggle">
              <span className="signup link" onClick={this.handleToggle}>
                {t("SignIn.SwitchToSignup")}
              </span>
            </div>
          )}
          <div className="auth-main__anonymous-login">
            {`${t("SignIn.AnonymousExplanation")} `}
            <Link
              to="/profile"
              onClick={() => {
                this.props.handleAuthChange();
                this.props.history.push("/profile");
              }}
            >
              {t("SignIn.Anonymous")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CustomSignIn);
