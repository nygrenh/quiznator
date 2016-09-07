import React from 'react';
import { connect } from 'react-redux';

import QuizBody from './quiz-body';
import QuizHeader from './quiz-header';
import EssayQuiz from './essay-quiz';
import MultipleChoiceQuiz from './multiple-choice-quiz';

import { ESSAY, MULTIPLE_CHOICE } from 'constants/quiz-types';
import withClassPrefix from 'utils/class-prefix';

const mapQuizTypeToComponent = {
  [ESSAY]: EssayQuiz,
  [MULTIPLE_CHOICE]: MultipleChoiceQuiz
}

class Quiz extends React.Component {
  constructor(props) {
    super(props);
  }

  renderBody() {
    if(this.props.quiz.data.type && mapQuizTypeToComponent[this.props.quiz.data.type]) {
      const Component = mapQuizTypeToComponent[this.props.quiz.data.type];

      return <Component quiz={this.props.quiz.data} onData={this.props.onData} answer={this.props.answer} onSubmit={this.props.onSubmit} disabled={this.props.disabled} submitted={this.props.quiz.submitted}/>
    } else {
      return null;
    }
  }


  render() {
    return (
      <div className={withClassPrefix('quiz-container')}>
        <QuizHeader isActive={this.props.answer !== undefined && (this.props.quiz.submitted || this.props.answer.isOld)}>
          {this.props.quiz.data.title}
        </QuizHeader>

        {this.props.children}

        <QuizBody>
          {this.renderBody()}
        </QuizBody>
      </div>
    );
  }
}

export const quizPropsTypes = {
  quiz: React.PropTypes.object.isRequired,
  answer: React.PropTypes.object,
  onData: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  onSubmit: React.PropTypes.func
}

Quiz.propTypes = quizPropsTypes

export const quizDefaultProps = {
  disabled: false,
  onData: () => {},
  onSubmit: () => {}
}

Quiz.defaultProps = quizDefaultProps

export default Quiz;
