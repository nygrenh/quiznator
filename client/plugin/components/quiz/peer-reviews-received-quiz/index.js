import React from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';
import PeerReviewReceived from './peer-review-received';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';
import { loadPeerReviewsReceived } from 'state/peer-reviews-received';
import withClassPrefix from 'utils/class-prefix';
import userResourceLoader from 'components/user-resource-loader';

class PeerReviewsReceivedQuiz extends React.Component {
  renderReviews() {
    return this.props.peerReviews.data.peerReviews.map(review => <PeerReviewReceived review={review}/>);
  }

  renderContent() {
    return (
      <div>
        <h4 className={withClassPrefix('m-t-0')}>{this.props.peerReviews.data.quiz.title}</h4>
        <div>
          {this.renderReviews()}
        </div>
      </div>
    )
  }

  hasPeerReviews() {
    return this.props.peerReviews.data && this.props.peerReviews.data.peerReviews.length > 0;
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

PeerReviewsReceivedQuiz.propTypes = Object.assign({},
  quizPropsTypes,
  {
    peerReviews: React.PropTypes.object
  }
);

PeerReviewsReceivedQuiz.defaultProps = Object.assign({},
  quizDefaultProps,
  {
    peerReviews: {}
  }
);

const mapStateToProps = (state, ownProps) => ({
  peerReviews: state.peerReviewsReceived[ownProps.quiz.data.quizId]
});

const withUserResourceLoader = userResourceLoader({
  dispatcher: (dispatch, ownProps) => dispatch(loadPeerReviewsReceived(ownProps.quiz.data.quizId))
})(PeerReviewsReceivedQuiz);

export default connect(
  mapStateToProps
)(withUserResourceLoader);
