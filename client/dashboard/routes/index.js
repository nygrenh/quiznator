import React from 'react';
import { Router, Route } from 'react-router';

import routes from './routes';

class Routes extends React.Component {
  render() {
    return <Router history={this.props.history} routes={routes}></Router>;
  }
}

export default Routes;
