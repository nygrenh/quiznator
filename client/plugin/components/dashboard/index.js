import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { selectAnswerableQuizzesWithAnswersAsArray, selectAnsweredQuizzesCount, selectAnswerableQuizzesCount } from 'selectors/quizzes';

class Dashboard extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('dashboard')}>
        <ul className={withClassPrefix('dashboard__quiz-list')}>
          {this.props.quizzes.map(quiz => {
            return (
              <li ckey={quiz.data._id} className={withClassPrefix(`dashboard__quiz-list__item ${quiz.answer.data ? 'text-success' : 'text-muted'}`)}>
                {quiz.data.title} {quiz.answer.data ? '\u2705' : null}
              </li>
            )
          })}
        </ul>

        <div className={withClassPrefix('m-t-1')}>
          You've finished {this.props.answeredCount} out of {this.props.totalCount} quizzes.
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  quizzes: selectAnswerableQuizzesWithAnswersAsArray(state),
  answeredCount: selectAnsweredQuizzesCount(state),
  totalCount: selectAnswerableQuizzesCount(state)
});

export default connect(
  mapStateToProps
)(Dashboard);
