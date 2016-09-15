import React from 'react';
import moment from 'moment';

import withClassPrefix from 'utils/class-prefix';

class PeerReviewReceived extends React.Component {
  render() {
    return (
      <div className={withClassPrefix('peer-review-received')}>
        {this.props.review.review}
        <div className={withClassPrefix('text-muted m-t-1')}>
          {moment(this.props.review.createdAt).format('D. MMMM YYYY')}
        </div>
      </div>
    )
  }
}

export default PeerReviewReceived;
