import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, Button, FormText } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { quizSelector } from 'selectors/edit-quiz';
import { fetchQuiz, saveQuiz, updateQuiz, removeQuiz } from 'state/edit-quiz';

import confirmation from 'components/confirmation';
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
          The quiz will expire at {moment(this.props.quiz.expiresAt).utc().format('D. MMMM HH:mm')} UTC
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

          <FormText color="muted" className="m-b-1">
            The quiz will expire at 23:59 UTC on the chosen date. After the quiz has expired, it can be no longer answered to.
          </FormText>
        </FormGroup>

        {this.renderExpiresAtAlert()}

        <div className="clearfix">
          <Button type="submit" color="primary" className="pull-xs-right">Save</Button>
        </div>
      </form>
    )
  }

  renderRemoveButton() {
    const ButtonWithConfirmation = confirmation()(Button);

    return (
      <ButtonWithConfirmation type="submit" color="danger" id="remove-quiz-button" onConfirm={this.props.onRemove}>
        <Icon name="trash"/> Remove quiz
      </ButtonWithConfirmation>
    );
  }

  renderContent() {
    return (
      <div>
        {this.renderForm()}

        <hr/>

        {this.renderRemoveButton()}
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

const mapStateToProps = state => ({
  quiz: quizSelector(state),
  loading: !!state.editQuiz.meta.loading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadQuiz: () => dispatch(fetchQuiz(ownProps.params.id)),
  onExpiresAtChange: expiresAt => dispatch(updateQuiz({ expiresAt })),
  onSave: () => dispatch(saveQuiz()),
  onRemove: () => dispatch(removeQuiz())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizSettings);
