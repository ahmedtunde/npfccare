import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AllAdmin from "./allAdmin";
import NewAdmin from "./newAdmin";
import adminDetails from "./adminDetails";

const AdminManagement = () => {
  const { path } = useRouteMatch();
  return (
    <div id="adminMan">
      <Switch>
        <Route exact path={path} component={AllAdmin} />
        <Route exact path={`${path}/createAdmin`} component={NewAdmin} />
        <Route exact path={`${path}/adminDetails`} component={adminDetails} />
      </Switch>
    </div>
  );
};

export default AdminManagement;
