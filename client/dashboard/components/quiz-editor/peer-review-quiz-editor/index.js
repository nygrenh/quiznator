import React from 'react';

import UsersQuizzesSelector from 'components/users-quizzes-selector';

import { ESSAY, MULTIPLE_CHOICE } from 'common-constants/quiz-types';

class PeerReviewQuizEditor extends React.Component {
  onQuizChange(value) {
    this.props.onDataChange({ quizId: value.value });
  }

  onAnsweringRequiredChange(e) {
    this.props.onDataChange({ answeringRequired: e.target.checked });
  }

  render() {
    const targetQuizId = (this.props.quiz.data || {}).quizId;
    const answeringRequired = !!(this.props.quiz.data || {}).answeringRequired;

    return (
      <div>
        <div className="form-group">
          <label>Quiz</label>
          <UsersQuizzesSelector name="peer-review-quiz" value={targetQuizId} types={[ESSAY, MULTIPLE_CHOICE]} onChange={this.onQuizChange.bind(this)}/>
        </div>

        <div className="form-group">
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" checked={answeringRequired} onChange={this.onAnsweringRequiredChange.bind(this)}/> Answering is required before submitting a peer review
            </label>
          </div>
        </div>
      </div>
    )
  }
};

export default PeerReviewQuizEditor;
