import React from 'react';
import get from 'lodash.get';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';

import withClassPrefix from 'utils/class-prefix';

class MultipleChoiceQuiz extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRadio(item) {
    return (
      <div key={item.id} className={withClassPrefix('radio')}>
        <label>
          <input type="radio" checked={this.getAnswer() === item.id} disabled={this.props.disabled} name={`${this.props.quiz._id}-multiple-choise`} value={item.id} onChange={this.onRadioChange(item.id)}/>
          {item.title}
        </label>
      </div>
    );
  }

  renderRadios() {
    return this.props.quiz.data.items.map(item => this.renderRadio(item));
  }

  onRadioChange(id) {
    return e => {
      this.props.onMultipleChoiceChange(id);
    }
  }

  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  getAnswer() {
    return get(this.props.answer, 'data');
  }

  render() {
    const isValid = !!this.getAnswer();

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          {this.renderRadios()}
        </div>

        <div className={withClassPrefix('form-group')}>
          <button type="submit" className={withClassPrefix('btn btn-primary')} disabled={!isValid}>Submit</button>
        </div>
      </form>
    )
  }
}

MultipleChoiceQuiz.propTypes = Object.assign({}, quizPropsTypes);

MultipleChoiceQuiz.defaultProps = Object.assign({}, quizDefaultProps);

export default MultipleChoiceQuiz;
