import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
import { Field, reduxForm } from 'redux-form'

const validate = values => {
  const errors = {};

  if(!values.email) {
    errors.email = 'Email is required';
  }

  if(!values.password) {
    errors.password = 'Password is required';
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

class SignInForm extends React.Component {

  onSubmit(e) {
    this.props.onSignIn();
    e.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))} noValidate>
        <Field name="email" component={renderField} label="Email" type="email" placeholder="Email"/>
        <Field name="password" component={renderField} label="Password" type="password" placeholder="Password"/>

        <div className="text-xs-center">
          <Button size="lg" disabled={this.props.submitting}>Sign in</Button>
        </div>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'signInForm',
  validate
})(SignInForm)
