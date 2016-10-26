import React from 'react';
import _get from 'lodash.get';

import withClassPrefix from 'utils/class-prefix';

import SubmitButton from 'components/quiz/submit-button';

class CheckboxQuiz extends React.Component {
  getAnswer() {
    return _get(this.props.answer, 'data') || [];
  }

  answerIncludes(id) {
    return this.getAnswer().indexOf(id) >= 0;
  }

  onCheckboxChange(e) {
    if(e.target.checked) {
      return this.props.onCheckboxChange([...this.getAnswer(), e.target.value]);
    } else {
      return this.props.onCheckboxChange([...this.getAnswer().filter(id => id !== e.target.value)]);
    }
  }

  renderCheckbox(item) {
    return (
      <div key={item.id} className={withClassPrefix('checkbox')}>
        <label>
          <input type="checkbox" checked={this.answerIncludes(item.id)} disabled={this.props.disabled} name={`${this.props.quiz._id}-multiple-choise`} value={item.id} onChange={this.onCheckboxChange.bind(this)}/>
          {item.title}
        </label>
      </div>
    );
  }

  renderCheckboxes() {
    return this.props.quiz.data.items.map(item => this.renderCheckbox(item));
  }

  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  render() {
    const isValid = this.getAnswer().length > 0;
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          {this.renderCheckboxes()}
        </div>

        <div className={withClassPrefix('form-group')}>
          <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
        </div>
      </form>
    )
  }
}

export default CheckboxQuiz;
