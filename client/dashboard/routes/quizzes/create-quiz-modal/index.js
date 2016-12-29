import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

import { toggleModal, createQuiz } from 'state/create-quiz';

const validate = values => {
  const errors = {};

  if(!values.title || values.title.length < 3 || values.title.length > 100) {
    errors.title = 'Title should be between 3 and 100 characters long'
  }

  return errors;
}

const renderField = field => {
  const hasError = field.meta.touched && !!field.meta.error;

  return (
    <FormGroup color={hasError ? 'danger' : ''}>
      <Label>{field.label}</Label>
      <Input {...field.input} type={field.type} name={field.name} placeholder={field.placeholder}/>
      {hasError && <FormFeedback>{field.meta.error}</FormFeedback>}
    </FormGroup>
  )
}

class CreateQuizModal extends React.Component {
  onSubmit(e) {
    return this.props.onSubmit();
  }

  renderForm() {
    return (
      <Form noValidate>
        <Field name="title" component={renderField} label="Title" type="text" placeholder="Title"/>
      </Form>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>New quiz</ModalHeader>
        <ModalBody>
          {this.renderForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="m-r-1" onClick={this.props.handleSubmit(this.onSubmit.bind(this))} disabled={this.props.submitting}>Save</Button>
          <Button color="secondary" onClick={this.props.onToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: !!state.createQuiz.modalIsOpen
});

const mapDispatchToProps = dispatch => ({
  onToggle: () => dispatch(toggleModal()),
  onSubmit: () => dispatch(createQuiz())
});

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateQuizModal);

export default reduxForm({
  validate,
  form: 'createQuiz'
})(container);
