import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { closeDashboard } from 'state/dashboard';
import { selectAnswerableQuizzesWithAnswersAsArray, selectAnsweredQuizzesCount, selectAnswerableQuizzesCount } from 'selectors/quizzes';

class DashboardWindow extends React.Component {
  renderQuizzesList() {
    return (
      <ul className={withClassPrefix('dashboard-window__quiz-list')}>
        {this.props.quizzes.map(quiz => {
          return (
            <li key={quiz.id} className={withClassPrefix(`dashboard-window__quiz-list-item ${quiz.answer.data ? 'text-success' : 'text-muted'}`)}>
              <a href={`#quiznator-plugin-${quiz.id}`}>{quiz.data.title}</a> {quiz.answer.data ? '\u2705' : null}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return this.props.isOpen
      ? (
        <div className={withClassPrefix('dashboard-window z-depth-1')}>
          <div className={withClassPrefix('dashboard-window__header')} onClick={this.props.onClose}>
            Close
          </div>

          <div className={withClassPrefix('dashboard-window__content')}>
            {this.renderQuizzesList()}
          </div>

          <div className={withClassPrefix('dashboard-window__footer')}>
            You've answered {this.props.answeredCount} out of {this.props.totalCount} quizzes.
          </div>
        </div>
      )
      : null;
  }
}

const mapStateToProps = state => ({
  isOpen: state.dashboard.isOpen,
  quizzes: selectAnswerableQuizzesWithAnswersAsArray(state),
  answeredCount: selectAnsweredQuizzesCount(state),
  totalCount: selectAnswerableQuizzesCount(state)
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeDashboard())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardWindow);
