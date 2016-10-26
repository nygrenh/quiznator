import React from 'react';
import { connect } from 'react-redux';

import QuizBody from './quiz-body';
import ReactMarkdown from 'react-markdown';
import QuizHeader from './quiz-header';

import EssayQuiz from './essay-quiz';
import MultipleChoiceQuiz from './multiple-choice-quiz';
import PeerReviewQuiz from './peer-review-quiz';
import PeerReviewsReceivedQuiz from './peer-reviews-received-quiz';
import CheckboxQuiz from './checkbox-quiz';

import { CHECKBOX, ESSAY, MULTIPLE_CHOICE, PEER_REVIEW, PEER_REVIEWS_RECEIVED } from 'common-constants/quiz-types';
import withClassPrefix from 'utils/class-prefix';

const mapQuizTypeToComponent = {
  [ESSAY]: EssayQuiz,
  [MULTIPLE_CHOICE]: MultipleChoiceQuiz,
  [PEER_REVIEW]: PeerReviewQuiz,
  [PEER_REVIEWS_RECEIVED]: PeerReviewsReceivedQuiz,
  [CHECKBOX]: CheckboxQuiz
}

class Quiz extends React.Component {
  renderBody() {
    if(this.props.quiz.type && mapQuizTypeToComponent[this.props.quiz.type]) {
      const Component = mapQuizTypeToComponent[this.props.quiz.type];

      return <Component {...this.props} answerSubmitted={this.isSubmitted()}/>
    } else {
      return null;
    }
  }

  renderHelper() {
    if(this.props.quiz.body) {
      return (
        <div className={withClassPrefix('quiz-container__helper')}>
          <ReactMarkdown source={this.props.quiz.body}/>
        </div>
      );
    } else {
      return null;
    }
  }

  isSubmitted() {
    return this.props.answer !== undefined && (this.props.submitted || this.props.answer.isOld);
  }

  render() {
    return (
      <div className={withClassPrefix('quiz-container')}>
        <QuizHeader isActive={this.isSubmitted()}>
          {this.props.quiz.title}
        </QuizHeader>

        {this.props.children}

        {this.renderHelper()}

        <QuizBody>
          {this.renderBody()}
        </QuizBody>
      </div>
    );
  }
}

export const quizPropsTypes = {
  quiz: React.PropTypes.object.isRequired,
  quizId: React.PropTypes.string.isRequired,
  answer: React.PropTypes.object,
  onEssayChange: React.PropTypes.func,
  onMultipleChoiceChange: React.PropTypes.func,
  onCheckboxChange: React.PropTypes.func,
  onPeerReviewReviewChange: React.PropTypes.func,
  onPeerReviewChosenReviewChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  submitted: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  answerSubmitted: React.PropTypes.bool,
  user: React.PropTypes.object,
  onSubmit: React.PropTypes.func
}

Quiz.propTypes = quizPropsTypes

export const quizDefaultProps = {
  disabled: false,
  sumitted: false,
  submitting: false,
  onEssayChange: () => {},
  onMultipleChoiceChange: () => {},
  onPeerReviewReviewChange: () => {},
  onPeerReviewChosenReviewChange: () => {},
  onCheckboxChange: () => {},
  onSubmit: () => {}
}

Quiz.defaultProps = quizDefaultProps

export default Quiz;
