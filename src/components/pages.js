import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Customers from './customers';
import SidePanel from './sidePanel';

const PagesComponent = props => {

  const { path } = useRouteMatch();
  return(
    <article style={{display: "flex", minHeight: "100vh"}}>
      <section>
        <SidePanel />
      </section>
      <section className="content">
        <Switch>
          <Route exact path={path}>
            <Redirect to={path + '/customers'}/>
          </Route>
          <Route path={path + '/customers'} component={Customers} />
          {/* <Route path={path + '/customers/customer'} component={Customer} /> */}
        </Switch>
      </section>
    </article>
  );
};

export default PagesComponent;