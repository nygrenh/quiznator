import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { Field, reduxForm } from 'redux-form'

const validate = values => {
  const errors = {};

  if(!values.email) {
    errors.email = 'Email is required';
  }

  if(!values.name) {
    errors.name = 'Name is required'
  }

  if(values.name && (values.name.length < 3 || values.name.length > 50)) {
    errors.name = 'Name must be between 3 and 50 characters long';
  }

  if(!values.password) {
    errors.password = 'Password is required';
  }

  if(values.password && values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if(values.password !== values.passwordConfirmation) {
    errors.password = 'Password didn\'t match the confirmation';
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

class SignUpForm extends React.Component {

  onSubmit(e) {
    this.props.onSignUp();
    e.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))} noValidate>
        <Field name="name" component={renderField} label="Name" type="text" placeholder="Name"/>
        <Field name="email" component={renderField} label="Email" type="email" placeholder="Email"/>
        <Field name="password" component={renderField} label="Password" type="password" placeholder="Password"/>
        <Field name="passwordConfirmation" component={renderField} label="Password confirmation" type="password" placeholder="Password confirmation"/>

        <div className="text-xs-center">
          <Button size="lg" disabled={this.props.submitting}>Sign up</Button>
        </div>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'signUpForm',
  validate
})(SignUpForm)
