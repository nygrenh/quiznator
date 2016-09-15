import React from 'react';

import UsersQuizzesSelector from 'components/users-quizzes-selector';

class PeerReviewQuizEditor extends React.Component {
  onQuizChange(value) {
    this.props.onDataChange({ quizId: value.value });
  }

  render() {
    const value = (this.props.quiz.data || {}).quizId;

    return (
      <div>
        <label>Quiz</label>
        <UsersQuizzesSelector name="peer-review-quiz" value={value} onChange={this.onQuizChange.bind(this)}/>
      </div>
    )
  }
};

export default PeerReviewQuizEditor;
