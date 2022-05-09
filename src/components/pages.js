import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Customers from "./customers";
import FailedBillings from "./failedBillings";
import LoanManagement from "./loanManagement";
import ResetPassword from "./resetPassword";
import SidePanel from "./sidePanel";
import AdminManager from "./admin";
import CustomerManager from "./helpDesk";
import AuditLogs from "../components/auditLogs";

const PagesComponent = (props) => {
  const { path } = useRouteMatch();
  return (
    <article style={{ display: "flex", minHeight: "100vh" }}>
      <section>
        <SidePanel />
      </section>
      <section className="content">
        <Switch>
          <Route exact path={path}>
            <Redirect to={path + "/customers"} />
          </Route>
          <Route path={path + "/customers"} component={Customers} />
          <Route path={path + "/loanMan"} component={LoanManagement} />
          <Route path={path + "/failedBillings"} component={FailedBillings} />
          <Route path={path + "/changePassword"} component={ResetPassword} />
          <Route path={path + "/superAdmin"} component={AdminManager} />
          <Route path={path + "/helpDesk"} component={CustomerManager} />
          <Route path={path + "/auditLog"} component={AuditLogs} />
        </Switch>
      </section>
    </article>
  );
};

export default PagesComponent;
