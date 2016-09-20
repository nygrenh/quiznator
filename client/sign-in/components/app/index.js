import React from 'react';
import { connect } from 'react-redux';

import SignInForm from 'components/sign-in-form';
import Alert from 'common-components/alert';

import { signIn } from 'state/sign-in';

class App extends React.Component {
  renderError() {
    return this.props.signInError
      ? (
        <Alert type="danger">
          Invalid credentials
        </Alert>
      )
      : null;
  }

  render() {
    return (
      <div className="sign-in-container">
        <div className="sign-in-form-container">
          <h1 className="text-xs-center">Sign in</h1>

          {this.renderError()}

          <SignInForm onSignIn={this.props.onSignIn.bind(this)}/>

          <div className="text-xs-center m-t-1">
            Haven't signed up yet? <a href="/sign-up">Sign up</a>.
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    signInError: state.signIn.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSignIn: () => {
      return dispatch(signIn());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
