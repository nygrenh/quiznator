import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { openDashboard } from 'state/dashboard';
import { selectAnsweredQuizzesCount, selectAnswerableQuizzesCount } from 'selectors/quizzes';

class DashboardOpener extends React.Component {
  render() {
    const progress = this.props.totalCount === 0 ? 0 : (this.props.answeredCount / this.props.totalCount) * 100;

    return this.props.isVisible
      ? (
        <div className={withClassPrefix('dashboard-opener z-depth-1 btn btn-primary')} onClick={this.props.onOpen}>
          <div className={withClassPrefix('dashboard-opener__progress')} style={{ width: `${progress}%` }}>
          </div>

          <div className={withClassPrefix('dashboard-opener__stats')}>
            {this.props.answeredCount} out of {this.props.totalCount} quizzes answered
          </div>

          <div className={withClassPrefix('dashboard-opener__details')}>
            Click here for details
          </div>
        </div>
      )
      : null;
  }
}

const mapStateToProps = state => ({
  isVisible: !state.dashboard.isOpen,
  answeredCount: selectAnsweredQuizzesCount(state),
  totalCount: selectAnswerableQuizzesCount(state)
});

const mapDispatchToProps = dispatch => ({
  onOpen: () => dispatch(openDashboard())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardOpener);
