import React from 'react';
import { Router, Route } from 'react-router'

class Foo extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

class Bar extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

class Routes extends React.Component {
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/dashboard">
          <Route path="foo" component={Foo}/>
          <Route path="bar" component={Bar}/>
        </Route>
      </Router>
    )
  }
}

export default Routes;
