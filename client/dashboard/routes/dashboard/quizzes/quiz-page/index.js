import React from 'react';

import QuizPageTabs from './quiz-page-tabs';

class QuizPage extends React.Component {
  render() {
    return (
      <div>
        <QuizPageTabs quizId={this.props.params.id} location={this.props.location}/>

        <div className="m-t-1">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default QuizPage;
