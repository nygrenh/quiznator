import React from 'react';
import { connect } from 'react-redux';

import Quiz from 'components/quiz';
import QuizAlerts from 'components/quiz-alerts';
import Alert from 'components/alert';
import Loader from 'components/loader';

import { fetchQuiz, submitQuiz } from 'state/quizzes';
import { updateQuizAnswer, getQuizAnswer } from 'state/quiz-answers';

import withClassPrefix from 'utils/class-prefix';

class QuizLoader extends React.Component {
  componentDidMount() {
    this.props.fetchQuiz();

    this.fetchAnswer();
  }

  componentDidUpdate(nextProps) {
    if(nextProps.user && nextProps.user !== this.props.user) {
      this.fetchAnswer();
    }
  }

  fetchAnswer() {
    if(this.props.user) {
      this.props.fetchAnswer();
    }
  }

  renderLoader() {
    return <Loader/>
  }

  renderError() {
    return (
      <div>Error</div>
    );
  }

  onQuizData(data) {
    this.props.updateQuizAnswer({
      quizId: this.props.id,
      data
    });
  }

  userIsSignedIn() {
    return this.props.user && this.props.user.id;
  }

  renderNotSignInAlert() {
    if(!this.userIsSignedIn()) {
      return (
        <div className={withClassPrefix('not-sign-in-alert-container')}>
          <Alert type="info">
            Sign in before answering
          </Alert>
        </div>
      );
    } else {
      return null;
    }
  }

  renderQuiz() {
    console.log(this.props.user);

    return (
      <Quiz quiz={this.props.quiz} onData={this.onQuizData.bind(this)} answer={this.props.answer} onSubmit={this.props.submitQuiz} disabled={!this.userIsSignedIn()}>
        {this.renderNotSignInAlert()}
        <QuizAlerts quizId={this.props.id}/>
      </Quiz>
    );
  }

  render() {
    let content = null;

    if(this.props.quiz.loading) {
      content = this.renderLoader();
    } else if(this.props.quiz.error) {
      content = this.renderError();
    } else if(this.props.quiz.data) {
      content = this.renderQuiz();
    }

    return (
      <div className={withClassPrefix(`quiz-loader`)}>
        {content}
      </div>
    );
  }
}

QuizLoader.propTypes = {
  id: React.PropTypes.string.isRequired
}

QuizLoader.defaultProps = {
  quiz: {}
}

const mapStateToProps = (state, props) => {
  console.log(state.user);
  return {
    quiz: state.quizzes[props.id.toString()],
    answer: state.quizAnswers[props.id.toString()],
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchQuiz: () => dispatch(fetchQuiz(props.id)),
    fetchAnswer: () => dispatch(getQuizAnswer({ quizId: props.id })),
    updateQuizAnswer: ({ quizId, data }) => dispatch(updateQuizAnswer({ quizId, data })),
    submitQuiz: () => dispatch(submitQuiz(props.id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizLoader);
