import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { quizSelector, quizMetaSelector } from 'selectors/quizzes';
import { fetchQuiz, saveQuiz, updateQuiz, removeQuiz } from 'state/quizzes';

import Loader from 'components/loader';
import Alert from 'common-components/alert';
import Icon from 'components/icon';

class QuizSettings extends React.Component {
  componentDidMount() {
    this.props.loadQuiz();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.id !== this.props.params.id) {
      this.props.loadQuiz();
    }
  }

  onExpiresAtChange(expiresAt) {
    const toUTC = expiresAt
      ? moment(expiresAt).utc().endOf('day').toDate()
      : expiresAt;

    this.props.onExpiresAtChange(toUTC);
  }

  getExpiresAt() {
    return this.props.quiz.expiresAt
      ? moment(this.props.quiz.expiresAt).utc()
      : null;
  }

  renderExpiresAtAlert() {
    return this.props.quiz.expiresAt
      ? (
        <Alert type="info">
          The quiz will expire at {moment(this.props.quiz.expiresAt).format('D. MMMM HH:mm')}
        </Alert>
      )
      : null;
  }

  onSave(e) {
    e.preventDefault();

    this.props.onSave();
  }

  renderForm() {
    return (
      <form onSubmit={this.onSave.bind(this)}>
        <FormGroup>
          <label>Expires at</label>
          <DatePicker dateFormat="DD.MM.YYYY" className="form-control" selected={this.getExpiresAt()} onChange={this.onExpiresAtChange.bind(this)}/>
        </FormGroup>

        {this.renderExpiresAtAlert()}

        <div className="clearfix">
          <Button type="submit" color="primary" className="pull-xs-right">Save</Button>
        </div>
      </form>
    )
  }

  renderContent() {
    return (
      <div>
        {this.renderForm()}

        <hr/>

        <Button color="danger" onClick={this.props.onRemove}>
          <Icon name="trash"/> Remove quiz
        </Button>
      </div>
    )
  }

  render() {
    if(this.props.loading) {
      return <Loader/>;
    } else if(this.props.quiz) {
      return this.renderContent();
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const quizId = ownProps.params.id;

  const quiz = quizSelector(state, quizId);
  const loading = !!(quizMetaSelector(state, quizId) || {}).loading;

  return { quiz, loading }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const quizId = ownProps.params.id;

  return {
    loadQuiz: () => dispatch(fetchQuiz(quizId)),
    onExpiresAtChange: expiresAt => dispatch(updateQuiz(quizId, { expiresAt })),
    onSave: () => dispatch(saveQuiz(quizId)),
    onRemove: () => dispatch(removeQuiz(quizId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizSettings);
