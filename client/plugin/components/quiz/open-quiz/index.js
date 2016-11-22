import React from 'react';
import _get from 'lodash.get';

import { quizPropsTypes, quizDefaultProps } from 'components/quiz';

import SubmitButton from 'components/quiz/submit-button';

import withClassPrefix from 'utils/class-prefix';

class OpenQuiz extends React.Component {
  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  onOpenChange() {
    this.props.onDataChange([], this.refs.open.value);
  }

  render() {
    const answerData = _get(this.props, 'answer.data') || '';
    const isValid = answerData.length > 0;
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit()}>
        <div className={withClassPrefix('form-group')}>
          <input type="text" disabled={this.props.disabled} className={withClassPrefix('textarea')} value={answerData} ref="open" maxLength={100} onChange={this.onOpenChange.bind(this)}/>
        </div>

        <div className={withClassPrefix('form-group')}>
          <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
        </div>
      </form>
    )
  }
}

OpenQuiz.propTypes = quizPropsTypes;
OpenQuiz.defaultProps = quizDefaultProps;

export default OpenQuiz;
