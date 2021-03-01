import React, { Fragment, useState } from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { ReactComponent as ChevronRight} from '../assets/icons/chevron-right.svg';
import { ReactComponent as SpinnerIcon} from '../assets/icons/spinner.svg';
import logo from '../assets/img/logo-main.png';
import { useAuth } from './utilities';

const SidePanel = props => {
  const sidePanelItems = [{
    name: "Loan Management",
    path: "/loanMan",
    next: "customers"
  },{
    name: "Customer Accounts",
    path: "/customers",
    prev: "loanMan",
    next: "eft"
  },{
    name: "Electronic Funds Transfer",
    path: "/eft",
    prev: "customers",
    next: "settings"
  },{
    name: "Settings",
    path: "/settings",
    prev: "eft",
    next: "helpDesk"
  },{
    name: "Help Desk",
    path: "/helpDesk",
    prev: "settings"
  }];

  const {url} = useRouteMatch();
  // const history = useHistory();
  const {pathname} = useLocation();

  const auth = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSignOut = e => {
    setLoading(true);
    auth.signout(() => setLoading(false));
  };

  return(
    <div className="side-panel">
      <div className="side-panel-header">
        <img className="mx-auto d-block" src={logo} alt=""/>
      </div>
      <div className="side-panel-items">
        {sidePanelItems.map(({name, path, next, prev}, idx) => (
        <Fragment key={idx}>
          {idx === 0 && <div className={`dummy item ${pathname.includes(path) ? "next-active" : ""}`}>
            <a href="#!">&nbsp;</a>
          </div>}
          <div
            className={`item
            ${pathname.includes(path) ? " active": ""}
            ${pathname.includes(prev) ? " prev-active": ""}
            ${pathname.includes(next) ? " next-active": ""}`}>
            <Link to={url + path}>
              {name}
              {!pathname.includes(path) && <span><ChevronRight /></span>}
            </Link>
          </div>
          {idx === (sidePanelItems.length - 1) && <div className={`item ${pathname.includes(path) ? "prev-active" : ""}`}>
            <a href="#!">&nbsp;</a>
          </div>}
        </Fragment>))}

      </div>
      <div className="signout-div">
        <button
          type="button"
          className={`btn btn-primary signout-btn ${loading ? "loading disabled" : ""}`}
          onClick={handleSignOut}>
            {loading ? <SpinnerIcon className="rotating" /> : "Sign Out"}
        </button>
      </div>
    </div>
  );

};

export default SidePanel;