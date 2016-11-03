import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash.get';
import className from 'classnames';
import moment from 'moment';

import { ESSAY, MULTIPLE_CHOICE } from 'common-constants/quiz-types';
import { fetchSpamFlag, toggleSpamFlag } from 'state/quiz-answer-spam-flags';
import { selectQuizAnswerIsSpamFlagged } from 'selectors/quiz-answer-spam-flags';
import withClassPrefix from 'utils/class-prefix';

class PeerReview extends React.Component {
  getTitle(id) {
    return ((this.props.quiz.data.items || []).find(item => item.id === id) || {}).title;
  }

  renderContentByType() {
    switch(this.props.quiz.type) {
      case ESSAY:
        return this.props.answer.data;
        break;
      case MULTIPLE_CHOICE:
        return this.getTitle(this.props.answer.data) || '';
        break;
      default:
        return '';
    }
  }

  componentDidMount() {
    this.props.onAnswerChange();
  }

  componentDidUpdate(prevProps) {
    if(this.props.answer && _get(prevProps, 'answer._id') !== _get(this.props, 'answer._id')) {
      this.props.onAnswerChange();
    }
  }

  render() {
    const chooseButtonClasses = withClassPrefix(className('btn', 'btn-primary', { 'btn-outline': !this.props.chosen }));
    const spamButtonClasses = withClassPrefix(className('btn', 'btn-danger', 'm-l-1', { 'btn-outline': this.props.flaggedAsSpam }));

    return (
      <div className={withClassPrefix('peer-review')}>
        <div className={withClassPrefix('peer-review__body')}>
          {this.renderContentByType()}

          <div className={withClassPrefix('text-muted m-t-1')}>
            {moment(this.props.answer.createdAt).format('D. MMMM YYYY')}
          </div>
        </div>

        <div className={withClassPrefix('peer_review__footer')}>
          <button className={chooseButtonClasses} onClick={this.props.onChoose}>
            {this.props.chosen ? 'Chosen' : 'Choose'}
          </button>

          <button className={spamButtonClasses} onClick={this.props.onToggleSpamFlag}>
            {this.props.flaggedAsSpam ? 'Don\'t flag as poor answer' : 'Flag as poor answer'}
          </button>
        </div>
      </div>
    )
  }
}

PeerReview.propTypes = {
  quiz: React.PropTypes.object.isRequired,
  answer: React.PropTypes.object.isRequired,
  chosen: React.PropTypes.bool,
  onChoose: React.PropTypes.func,
  flaggedAsSpam: React.PropTypes.bool
}

PeerReview.defaultProps = {
  chosen: false,
  flaggedAsSpam: false
}

const mapStateToProps = (state, ownProps) => ({
  flaggedAsSpam: selectQuizAnswerIsSpamFlagged(state, { answerId: ownProps.answer._id })
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAnswerChange: () => dispatch(fetchSpamFlag(ownProps.answer._id)),
  onToggleSpamFlag: () => dispatch(toggleSpamFlag(ownProps.answer._id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerReview);
