import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash.get';

import Loader from 'components/loader';
import PeerReview from './peer-review';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';
import { loadPeerReviews } from 'state/peer-reviews';
import withClassPrefix from 'utils/class-prefix';

class PeerReviewQuiz extends React.Component {
  componentDidMount() {
    this.fetchPeerReviews();
  }

  fetchPeerReviews() {
    if(this.props.user && this.props.user.id) {
      this.props.loadPeerReviews();
    }
  }

  componentDidUpdate(nextProps) {
    if(this.props.user && nextProps.user && nextProps.user.id !== this.props.user.id) {
      this.fetchPeerReviews();
    }
  }

  onChoosePeerReview(chosenId, rejectedId) {
    return e => {
      e.preventDefault();

      this.props.onData({
        chosen: chosenId,
        rejected: rejectedId,
        review: this.refs.review.value
      });
    }
  }

  onReviewChange(e) {
    e.preventDefault();

    this.props.onData(Object.assign({}, this.getReviewData(), {
      review: this.refs.review.value
    }));
  }

  getReviewData() {
    const chosen = this.getChosenReview();

    const rejected = chosen
      ? this.props.peerReviews.data.peerReviews.find(review => review._id !== chosen)._id
      : undefined;

    return { chosen, rejected };
  }

  getChosenReview() {
    return get(this.props.answer, 'data.chosen');
  }

  validate() {
    return get(this.props.answer, 'data.chosen') && get(this.props.answer, 'data.review');
  }

  onSubmit(e) {
    e.preventDefault();

    if(this.validate()) {
      this.props.onSubmit();
    }
  }

  renderForm() {
    const isValid = this.validate();

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className={withClassPrefix('form-group')}>
          <textarea disabled={this.props.disabled} onChange={this.onReviewChange.bind(this)} className={withClassPrefix('textarea')} rows={5} ref="review">
          </textarea>
        </div>

        <div className={withClassPrefix('form-group')}>
          <button type="submit" disabled={!isValid} className={withClassPrefix('btn btn-primary')}>Submit</button>
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
          <PeerReview quiz={quiz} answer={firstReview} chosen={this.getChosenReview() === firstReview._id} onChoose={this.onChoosePeerReview(firstReview._id, secondReview._id)}/>
        </div>

        <div className={withClassPrefix('peer-review-container__answer')} key={secondReview._id}>
          <PeerReview quiz={quiz} answer={secondReview} chosen={this.getChosenReview() === secondReview._id} onChoose={this.onChoosePeerReview(secondReview._id, firstReview._id)}/>
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
    peerReviews: {},
    loadPeerReviews: () => {}
  }
);


const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPeerReviews: () => dispatch(loadPeerReviews(ownProps.quizId))
});

const mapStateToProps = (state, ownProps) => {
  return {
    peerReviews: state.peerReviews[ownProps.quizId]
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerReviewQuiz);
