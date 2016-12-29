import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, FormText, Label } from 'reactstrap';

import { toggleModal, setMethod, setQuiz, setTagsFrom, setTagsTo, applyCloning } from 'state/clone-quizzes';
import UsersQuizzesSelector from 'components/users-quizzes-selector';
import UsersTagsSelector from 'components/users-tags-selector';

class CloneQuizzesModal extends React.Component {
  constructor() {
    super();

    this.onMethodChange = this.onMethodChange.bind(this);
    this.onQuizChange = this.onQuizChange.bind(this);
    this.onTagsFromChange = this.onTagsFromChange.bind(this);
    this.onTagsToChange = this.onTagsToChange.bind(this);
  }

  formatTags(tags) {
    return (tags || []).map(tag => tag.value)
  }

  onTagsFromChange(tags) {
    this.props.onTagsFromChange(this.formatTags(tags));
  }

  onTagsToChange(tags) {
    this.props.onTagsToChange(this.formatTags(tags));
  }

  onQuizChange(quiz) {
    this.props.onQuizChange(quiz.value);
  }

  renderQuizMethodForm() {
    return (
      <UsersQuizzesSelector
        value={this.props.quizId}
        onChange={this.onQuizChange}
      />
    );
  }

  getTagOptions(tags) {
    return (tags || []).map(tag => ({ value: tag, label: tag }));
  }

  renderTagsMethodForm() {
    const tagsFromOptions = this.getTagOptions(this.props.tagsFrom);
    const tagsToOptions = this.getTagOptions(this.props.tagsTo);

    return (
      <div>
        <FormGroup>
          <Label>
            Tags to clone from
          </Label>

          <UsersTagsSelector
            value={this.props.tagsFrom}
            options={tagsFromOptions}
            onChange={this.onTagsFromChange}
          />

          <FormText color="muted">
            All quizzes having these tags will be cloned.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label>
            Tags to clone to
          </Label>

          <UsersTagsSelector
            value={this.props.tagsTo}
            options={tagsToOptions}
            onChange={this.onTagsToChange}
          />

          <FormText color="muted">
            All cloned quizzes will get these tags.
          </FormText>
        </FormGroup>
      </div>
    )
  }

  renderMethodForm() {
    switch(this.props.method) {
      case 'quiz':
        return this.renderQuizMethodForm();
        break;
      case 'tags':
        return this.renderTagsMethodForm();
        break;
      default:
        return null;
    }
  }

  onMethodChange(e) {
    const method = e.target.value;

    this.props.onMethodChange(method);
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>Clone existing quizzes</ModalHeader>
        <ModalBody>
          <div className="m-b-2">
            <FormGroup check>
              <Label check>
                <input
                  type="radio"
                  name="clone-method"
                  value="quiz"
                  checked={this.props.method === 'quiz'}
                  onChange={this.onMethodChange}
                />
                {' '}
                Choose quiz to clone
              </Label>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <input
                  type="radio"
                  name="clone-method"
                  value="tags"
                  checked={this.props.method === 'tags'}
                  onChange={this.onMethodChange}
                />
                {' '}
                Choose tags to clone
              </Label>
            </FormGroup>
          </div>

          {this.renderMethodForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="m-r-1" onClick={this.props.onClone}>Clone</Button>
          <Button color="secondary" onClick={this.props.onToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: !!state.cloneQuizzes.modalIsOpen,
  method: state.cloneQuizzes.method,
  quizId: state.cloneQuizzes.quizId,
  tagsFrom: state.cloneQuizzes.tagsFrom,
  tagsTo: state.cloneQuizzes.tagsTo
});

const mapDispatchToProps = dispatch => ({
  onToggle: () => dispatch(toggleModal()),
  onClone: () => dispatch(applyCloning()),
  onMethodChange: method => dispatch(setMethod(method)),
  onQuizChange: quizId => dispatch(setQuiz(quizId)),
  onTagsFromChange: tags => dispatch(setTagsFrom(tags)),
  onTagsToChange: tags => dispatch(setTagsTo(tags))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CloneQuizzesModal);
