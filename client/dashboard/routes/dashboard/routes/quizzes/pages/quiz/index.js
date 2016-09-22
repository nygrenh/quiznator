import React from 'react';

import QuizTabs from './quiz-tabs';

class Quiz extends React.Component {
  render() {
    return (
      <div>
        <QuizTabs quizId={this.props.params.id} location={this.props.location}/>

        <div className="m-t-1">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Quiz;
