import React from 'react';
import { connect } from 'react-redux';

import Alert from 'components/alert';
import { removeAlert } from 'state/quiz-alerts';
import withClassPrefix from 'utils/class-prefix';

class QuizAlerts extends React.Component {
  onCloseAlert(id) {
    return e => {
      e.preventDefault();
      this.props.onCloseAlert(id);
    }
  }

  render() {
    if(this.props.alerts && this.props.alerts.length > 0) {
      const alerts = this.props.alerts.map(alert => {
        return (
          <Alert type={alert.type} key={alert.id} dismissible={true} onClose={this.onCloseAlert(alert.id)}>
            {alert.content}
          </Alert>
        );
      });

      return (
        <div className={withClassPrefix('quiz-alerts-container')}>
          {alerts}
        </div>
      )
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseAlert: id => dispatch(removeAlert({ quizId: ownProps.quizId, id }))
});

const mapStateToProps = (state, ownProps) => ({
  alerts: state.quizAlerts[ownProps.quizId]
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizAlerts);
