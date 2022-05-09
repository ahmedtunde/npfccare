import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import AllCustomers from "./allCustomers";
import CustomerDetails from "./customerDetails";

const CustomerManager = () => {
  const { path } = useRouteMatch();
  return (
    <div id="customerMan">
      <Switch>
        <Route exact path={path} component={AllCustomers} />
        <Route
          exact
          path={`${path}/customerDetails`}
          component={CustomerDetails}
        />
      </Switch>
    </div>
  );
};

export default CustomerManager;
