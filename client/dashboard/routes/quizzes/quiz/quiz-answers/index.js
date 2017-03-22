import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FormGroup } from 'reactstrap';

import { fetchQuizAnswers, updateConfirmation } from 'state/quiz-answers';
import { selectQuizAnswers } from 'selectors/quiz-answers';
import Loader from 'components/loader';
import Truncator from 'components/truncator';

class QuizAnswers extends React.Component {
  componentDidMount() {
    this.props.onFetchQuizAnswers(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      this.props.onFetchQuizAnswers(this.props.params.id);
    }
  }

  onDateToChange(date) {
    if (date) {
      this.props.onUpdateDate(date.format('DD-MM-YYYY'));
    } else {
      this.props.onUpdateDate(null);
    }
  }

  getDateTo() {
    return this.props.dateTo
      ? moment(this.props.dateTo, 'DD-MM-YYYY')
      : null;
  }

  renderFilters() {
    return (
      <div>
        <FormGroup>
          <label>Before date</label>
          <DatePicker dateFormat="DD-MM-YYYY" className="form-control" selected={this.getDateTo()} onChange={this.onDateToChange.bind(this)}/>
        </FormGroup>

        <hr />
      </div>
    );
  }

  renderConfirmationButton(answer) {
    const confirmed = !!answer.confirmed;

    return (
      <button className={`btn ${confirmed ? 'btn-danger' : 'btn-primary' } btn-sm pull-xs-right`} onClick={() => this.props.onUpdateConfirmation({ answerId: answer.answerId, confirmed: !confirmed })}>
        {confirmed ? 'Remove confirmation' : 'Confirm' }
      </button>
    );
  }

  renderAnswer(answer) {
    return (
      <div key={answer.answererId}>
        {this.renderConfirmationButton(answer)}
        <h4>{answer.answererId}</h4>
        <h5>Latest answer</h5>
        <p>
          <Truncator content={answer.data} length={200} />
        </p>

        <p className="text-muted">
          Spam flags: {answer.spamFlags} · Peer reviews given: {answer.givenPeerReviewsCount}
        </p>

        <h5>Peer reviews received</h5>

        {answer.receivedPeerReviews.map(peerReview => {
          return (
            <div className="card" key={peerReview._id}>
              <div className="card-block">
                <Truncator content={peerReview.review} length={100} />
              </div>
            </div>
          );
        })}
        <hr />
      </div>
    );
  }

  renderAnswers() {
    return (
      <div>
        {this.props.answers.map(answer => this.renderAnswer(answer))}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderFilters()}
        {this.props.loading ? <Loader/> : this.renderAnswers()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchQuizAnswers: quizId => dispatch(fetchQuizAnswers(quizId)),
  onUpdateConfirmation: ({ answerId, confirmed }) => dispatch(updateConfirmation({ answerId, confirmed })),
  onUpdateDate: date => dispatch(push({ query: date ? { dateTo: date } : {}, pathname: ownProps.location.pathname }))
});

const mapStateToProps = state => ({
  answers: selectQuizAnswers(state),
  dateTo: state.quizAnswers.filters.dateTo,
  loading: state.quizAnswers.loading,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuizAnswers);