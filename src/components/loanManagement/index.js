import { Route, Switch, useRouteMatch } from "react-router-dom";
import AllLoanApplications from "./AllLoanApplications";
import Customer from "./customer";
import InProcessCustomer from "./customer/inProcess";
import LoanSchedule from "./customer/loanSchedule";
import NewApplications from "./newApplications";

const LoanManagement = (props) => {
  const { path } = useRouteMatch();
  return (
    <div id="loanMan">
      <Switch>
        <Route exact path={path} component={AllLoanApplications} />
        <Route exact path={`${path}/customer`} component={Customer} />
        <Route exact path={`${path}/inProcess`} component={InProcessCustomer} />
        <Route path={`${path}/new`} component={NewApplications} />
        <Route exact path={`${path}/schedule`} component={LoanSchedule} />
      </Switch>
    </div>
  );
};

export default LoanManagement;
