import { Route, Switch, useRouteMatch } from "react-router-dom";
import CreateNewLoanApplication from "./createNewLoanApplication";
import SelectCustomer from "./selectCustomer";

const NewApplications = (props) => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}`} component={CreateNewLoanApplication} />
      <Route path={`${path}/selectCustomer`} component={SelectCustomer} />
    </Switch>
  );
};

export default NewApplications;
