import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { selectQuizzesWithAnswersAsArray } from 'selectors/quizzes';

class Dashboard extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('dashboard')}>
        Hello world!
      </div>
    );
  }
}

const mapStateToProps = state => ({
  quizzes: selectQuizzesWithAnswersAsArray(state)
});

export default connect(
  mapStateToProps
)(Dashboard);
