import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Form } from 'reactstrap';

import { toggleEditQuizModal, updateQuiz } from 'state/edit-quiz';

class EditQuizModal extends React.Component {
  onSubmit(e) {
  }

  onUpdateTitle() {
    this.props.onUpdate({ title: this.refs.title.value });
  }

  onUpdateBody() {
    this.props.onUpdate({ body: this.refs.body.value });
  }

  renderForm() {
    return (
      <Form>
        <FormGroup>
          <label>Title</label>
          <input type="text" placeholder="Title" className="form-control" value={this.props.quiz.title} ref="title" onChange={this.onUpdateTitle.bind(this)}/>
        </FormGroup>

        <FormGroup>
          <label>Body</label>
          <textarea className="form-control" rows={3} value={this.props.quiz.body} ref="body" onChange={this.onUpdateBody.bind(this)}></textarea>
        </FormGroup>
      </Form>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>Edit quiz</ModalHeader>
        <ModalBody>
          {this.props.quiz && this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="m-r-1" onClick={this.onSubmit.bind(this)}>Save</Button>
          <Button color="secondary" onClick={this.props.onToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  quiz: state.editQuiz.quiz,
  isOpen: !!state.editQuiz.modalIsOpen
});

const mapDispatchToProps = dispatch => ({
  onUpdate: update => dispatch(updateQuiz(update)),
  onToggle: () => dispatch(toggleEditQuizModal())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQuizModal);
