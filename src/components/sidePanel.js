import React, { Fragment, useState } from "react";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { ReactComponent as ChevronRight } from "../assets/icons/chevron-right.svg";
import { ReactComponent as SpinnerIcon } from "../assets/icons/spinner.svg";
import logo from "../assets/img/logo-main.png";
import { useAuth } from "./utilities";
import { initiatePasswordRest } from "../services/authService";
import { getRoles } from "../utils/localStorageService";
import notify from "../utils/notification";

const SidePanel = (props) => {
  const auth = useAuth();
  const roles = getRoles();

  const sidePanelItems = [
    {
      name: "Loan Management",
      path: "/loanMan",
      next: roles === "LOAN OFFICER" ? "settings" : "customers",
      user: ["LOAN OFFICER", "AUDIT"],
    },
    {
      name: "Customer Accounts",
      path: "/customers",
      prev: "loanMan",
      next: "failedBillings",
      user: ["CSO", "AUDIT"],
    },
    {
      name: "Failed Billing History",
      path: "/failedBillings",
      prev: "customers",
      next: roles === "AUDIT" ? "settings" : "eft",
      user: ["CSO", "SUPER ADMIN", "AUDIT"],
    },
    {
      name: "Electronic Funds Transfer",
      path: "/eft",
      prev: "failedBillings",
      next: roles === "AUDIT" ? "helpDesk" : "settings",
      user: ["CSO", "SUPER ADMIN"],
    },
    {
      name: "Settings",
      path: "/settings",
      prev:
        roles === "AUDIT"
          ? "failedBillings"
          : roles === "LOAN OFFICER"
          ? "loanMan"
          : "eft",
      next:
        roles === "AUDIT" || roles === "LOAN OFFICER" || roles === "CSO"
          ? "changePassword"
          : "helpDesk",
      user: ["CSO", "SUPER ADMIN", "LOAN OFFICER", "AUDIT"],
    },
    {
      name: "Customer Management",
      path: "/helpDesk",
      prev: "settings",
      next: "changePassword",
      user: ["SUPER ADMIN"],
    },
    {
      name: "Change Password",
      path: "/changePassword",
      prev:
        roles === "AUDIT" || roles === "LOAN OFFICER" || roles === "CSO"
          ? "settings"
          : "helpDesk",
      next: "superAdmin",
      user: ["CSO", "SUPER ADMIN", "LOAN OFFICER", "AUDIT"],
    },
    {
      name: "Admin Management",
      path: "/superAdmin",
      prev: "changePassword",
      // next: "auditLog",
      user: ["SUPER ADMIN"],
    },
  ];

  const { url } = useRouteMatch();
  // const history = useHistory();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(false);
  const [resetloading, setResetLoading] = useState(false);

  const handleSignOut = (e) => {
    setLoading(true);
    auth.signout(() => setLoading(false));
  };

  const handleResetPassword = async (e) => {
    setResetLoading(true);

    let result = await initiatePasswordRest();

    if (!result.error) notify(result.message, "success");

    setResetLoading(false);
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <img className="mx-auto d-block" src={logo} alt="" />
      </div>
      <div className="side-panel-items">
        {sidePanelItems.map(({ name, path, next, prev, user }, idx) => (
          <Fragment key={idx}>
            {idx === 0 && (
              <div
                className={`dummy item ${
                  pathname.includes(path) ? "next-active" : ""
                }`}
              >
                <a href="#!">&nbsp;</a>
              </div>
            )}
            <div
              className={`item
            ${pathname.includes(path) ? " active" : ""}
            ${pathname.includes(prev) ? " prev-active" : ""}
            ${pathname.includes(next) ? " next-active" : ""}`}
            >
              {user.includes(auth.user[0]) && (
                <Link to={url + path}>
                  {name}
                  {!pathname.includes(path) && (
                    <span>
                      <ChevronRight />
                    </span>
                  )}
                </Link>
              )}
            </div>
            {idx === sidePanelItems.length - 1 && (
              <div
                className={`item ${
                  pathname.includes(path) ? "prev-active" : ""
                }`}
              >
                <a href="#!">&nbsp;</a>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* <div className="reset-div">
        <button
          type="button"
          className={`btn btn-primary signout-btn ${resetloading ? "loading disabled" : ""}`}
          onClick={handleResetPassword}>
            {resetloading ? <SpinnerIcon className="rotating" /> : "Reset Password"}
        </button>
      </div> */}

      <div className="signout-div">
        <button
          type="button"
          className={`btn btn-primary signout-btn ${
            loading ? "loading disabled" : ""
          }`}
          onClick={handleSignOut}
        >
          {loading ? <SpinnerIcon className="rotating" /> : "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
