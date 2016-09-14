import React from 'react';

import QuizPageTabs from './quiz-page-tabs';

class QuizPage extends React.Component {
  render() {
    return (
      <div>
        <QuizPageTabs/>

        <div className="m-t-1">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default QuizPage;
