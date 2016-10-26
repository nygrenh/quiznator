import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash.get';

import Loader from 'components/loader';
import PeerReview from './peer-review';
import SubmitButton from 'components/quiz/submit-button';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';
import { loadPeerReviews } from 'state/peer-reviews';
import withClassPrefix from 'utils/class-prefix';
import userResourceLoader from 'components/user-resource-loader';

class PeerReviewQuiz extends React.Component {
  onChoosePeerReview(chosen, rejected) {
    return e => {
      e.preventDefault();

      this.props.onPeerReviewChosenReviewChange({
        chosenQuizAnswerId: chosen._id,
        rejectedQuizAnswerId: rejected._id
      });
    }
  }

  onReviewChange(e) {
    e.preventDefault();

    this.props.onPeerReviewReviewChange(this.refs.review.value);
  }

  getChosenReview() {
    return _get(this.props.answer, 'data.chosenQuizAnswerId');
  }

  validate() {
    return this.getChosenReview() && _get(this.props.answer, 'data.review');
  }

  onSubmit(e) {
    e.preventDefault();

    if(this.validate()) {
      this.props.onSubmit();
    }
  }

  renderForm() {
    const isValid = this.validate();
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className={withClassPrefix('form-group')}>
          <textarea disabled={this.props.disabled} onChange={this.onReviewChange.bind(this)} className={withClassPrefix('textarea')} rows={5} maxLength={5000} ref="review">
          </textarea>
        </div>

        <div className={withClassPrefix('form-group')}>
          <SubmitButton disabled={submitDisabled} submitting={this.props.submitting}/>
        </div>
      </form>
    );
  }

  renderContent() {
    return (
      <div className={withClassPrefix('peer-review-wrapper')}>
        <h4>{this.props.peerReviews.data.quiz.title}</h4>

        {this.renderPeerReviews()}
        {this.renderForm()}
      </div>
    );
  }

  renderPeerReviews() {
    const quiz = this.props.peerReviews.data.quiz;
    const firstReview = this.props.peerReviews.data.peerReviews[0];
    const secondReview = this.props.peerReviews.data.peerReviews[1];

    return (
      <div className={withClassPrefix('peer-review-container')}>
        <div className={withClassPrefix('peer-review-container__answer')} key={firstReview._id}>
          <PeerReview quiz={quiz} answer={firstReview} chosen={this.getChosenReview() === firstReview._id} onChoose={this.onChoosePeerReview(firstReview, secondReview)}/>
        </div>

        <div className={withClassPrefix('peer-review-container__answer')} key={secondReview._id}>
          <PeerReview quiz={quiz} answer={secondReview} chosen={this.getChosenReview() === secondReview._id} onChoose={this.onChoosePeerReview(secondReview, firstReview)}/>
        </div>
      </div>
    );
  }

  hasPeerReviews() {
    return this.props.peerReviews.data && this.props.peerReviews.data.peerReviews.length > 1;
  }

  render() {
    if(this.props.peerReviews.loading) {
      return <Loader/>;
    } else if(this.hasPeerReviews()) {
      return this.renderContent();
    } else {
      return (
        <div className={withClassPrefix('text-muted')}>
          No peer reviews currently available
        </div>
      );
    }
  }
}

PeerReviewQuiz.propTypes = Object.assign({},
  quizPropsTypes,
  {
    peerReviews: React.PropTypes.object
  }
);

PeerReviewQuiz.defaultProps = Object.assign({},
  quizDefaultProps,
  {
    peerReviews: {}
  }
);

const mapStateToProps = (state, ownProps) => {
  return {
    peerReviews: state.peerReviews[ownProps.quiz.data.quizId]
  }
};

const withUserResourceLoader = userResourceLoader({
  dispatcher: (dispatch, ownProps) => dispatch(loadPeerReviews(ownProps.quiz.data.quizId))
})(PeerReviewQuiz);

export default connect(
  mapStateToProps
)(withUserResourceLoader);
