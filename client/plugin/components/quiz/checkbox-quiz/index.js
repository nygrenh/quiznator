import React from 'react';
import get from 'lodash.get';

import withClassPrefix from 'utils/class-prefix';

class CheckboxQuiz extends React.Component {
  getAnswer() {
    return get(this.props.answer, 'data') || [];
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

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          {this.renderCheckboxes()}
        </div>

        <div className={withClassPrefix('form-group')}>
          <button type="submit" className={withClassPrefix('btn btn-primary')} disabled={!isValid || !!this.props.disabled}>Submit</button>
        </div>
      </form>
    )
  }
}

export default CheckboxQuiz;
