import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Quiz from 'components/quiz';
import QuizAlerts from 'components/quiz-alerts';
import Alert from 'components/alert';
import Loader from 'components/loader';

import { fetchQuiz, submitQuiz } from 'state/quizzes';
import { setQuizAnswerDataPath, getQuizAnswer } from 'state/quiz-answers';

import withClassPrefix from 'utils/class-prefix';

class QuizLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notSignedInAlertIsShowing: true,
      expiresAtAlertIsShowing: true,
      isExpiredAlertIsShowing: true
    }
  }

  componentDidMount() {
    this.props.loadQuiz();
  }

  componentWillReceiveProps(nextProps) {
    this.props.loadAnswer();
  }

  onCloseAlert(name) {
    this.setState({
      [`${name}IsShowing`]: false
    });
  }

  isSubmitting() {
    return this.props.answer && this.props.answer.submitting;
  }

  renderLoader() {
    return <Loader/>
  }

  renderError() {
    return (
      <div className={withClassPrefix('loading-error-container')}>
        <Alert type="danger">
          Couldn't load the quiz
        </Alert>
      </div>
    );
  }

  userIsSignedIn() {
    return this.props.user && this.props.user.id;
  }

  renderNotSignInAlert() {
    return !this.userIsSignedIn() && this.state.notSignedInAlertIsShowing
      ? (
        <div className={withClassPrefix('quiz-alert')}>
          <Alert type="info" dismissible={true} onClose={this.onCloseAlert.bind(this, 'notSignedInAlert')}>
            Sign in before answering
          </Alert>
        </div>
      )
      : null;
  }

  renderExpireDateAlert() {
    return this.props.quiz.data.expiresAt && !this.isExpired() && this.state.expiresAtAlertIsShowing
      ? (
        <div className={withClassPrefix('quiz-alert')}>
          <Alert type="info" dismissible={true} onClose={this.onCloseAlert.bind(this, 'expiresAtAlert')}>
            This quiz will expire at {moment(this.props.quiz.data.expiresAt).format('D. MMMM HH:mm')}
          </Alert>
        </div>
      )
      : null;
  }

  renderExpiredAlert() {
    return this.isExpired() && this.state.isExpiredAlertIsShowing
      ? (
        <div className={withClassPrefix('quiz-alert')}>
          <Alert type="info" dismissible={true} onClose={this.onCloseAlert.bind(this, 'isExpiredAlert')}>
            This quiz has expired
          </Alert>
        </div>
      )
      : null;
  }

  onEssayChange(essay) {
    this.props.onDataChange([], essay);
  }

  onMultipleChoiceChange(choice) {
    this.props.onDataChange([], choice);
  }

  onCheckboxChange(checked) {
    this.props.onDataChange([], checked);
  }

  onPeerReviewChosenReviewChange({ chosenQuizAnswerId, rejectedQuizAnswerId }) {
    this.props.onDataChange(['chosenQuizAnswerId'], chosenQuizAnswerId);
    this.props.onDataChange(['rejectedQuizAnswerId'], rejectedQuizAnswerId);
  }

  onPeerReviewReviewChange(review) {
    this.props.onDataChange(['review'], review);
  }

  isExpired() {
    const expiresAt = this.props.quiz.data.expiresAt;

    return expiresAt !== null && +new Date(expiresAt) <= +new Date();
  }

  getQuizProperties() {
    return {
      quiz: this.props.quiz.data,
      user: this.props.user,
      onDataChange: this.props.onDataChange,
      onEssayChange: this.onEssayChange.bind(this),
      onMultipleChoiceChange: this.onMultipleChoiceChange.bind(this),
      onCheckboxChange: this.onCheckboxChange.bind(this),
      onPeerReviewReviewChange: this.onPeerReviewReviewChange.bind(this),
      onPeerReviewChosenReviewChange: this.onPeerReviewChosenReviewChange.bind(this),
      answer: this.props.answer,
      submitting: this.isSubmitting(),
      submitted: this.props.quiz.submitted,
      onSubmit: this.props.onSubmit,
      disabled: !this.userIsSignedIn() || this.isExpired(),
      quizId: this.props.id
    }
  }

  renderQuiz() {
    return (
      <Quiz {...this.getQuizProperties()}>
        {this.renderNotSignInAlert()}
        {this.renderExpiredAlert()}
        {this.renderExpireDateAlert()}
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
      <div className={withClassPrefix(`quiz-loader z-depth-1`)}>
        <a name={`quiznator-plugin-${this.props.id}`}></a>
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
  return {
    quiz: state.quizzes[props.id.toString()],
    answer: state.quizAnswers[props.id.toString()],
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadQuiz: () => dispatch(fetchQuiz(ownProps.id)),
    loadAnswer: () => dispatch(getQuizAnswer({ quizId: ownProps.id })),
    onDataChange: (path, value) => dispatch(setQuizAnswerDataPath(ownProps.id, path, value)),
    onSubmit: () => dispatch(submitQuiz(ownProps.id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizLoader);
