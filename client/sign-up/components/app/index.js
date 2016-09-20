import React from 'react';
import { connect } from 'react-redux';

import SignUpForm from 'components/sign-up-form';
import Alert from 'common-components/alert';

import { signUp } from 'state/sign-up';

class App extends React.Component {
  render() {
    return (
      <div className="sign-up-container">
        <div className="sign-up-form-container">
          <h1 className="text-xs-center">Sign up</h1>

          <SignUpForm onSignUp={this.props.onSignUp}/>

          <div className="m-t-1 text-xs-center">
            Already signed up? <a href="/sign-in">Sign in</a>.
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    onSignUp: () => {
      return dispatch(signUp());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
