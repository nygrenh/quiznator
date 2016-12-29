import React from 'react';
import lget from 'lodash.get';

import withClassPrefix from 'utils/class-prefix';

import SubmitButton from 'components/quiz/submit-button';

class ScaleQuiz extends React.Component {
  getItems() {
    return lget(this.props.quiz, 'data.items') || [];
  }

  getScale() {
    return +(lget(this.props.quiz, 'data.scale') || 7);
  }

  getScaleValueForItem(itemId) {
    return lget(this.props.answer, ['data', itemId]);
  }

  renderScales(item) {
    const quizId = lget(this.props.quiz, '_id');

    return (new Array(this.getScale()))
      .fill(null)
      .map((scale, index) => (
        <div
          className={withClassPrefix('scale-quiz__scale-container')}
          key={index}
        >
          {index + 1}
          <input
            type="radio"
            name={`${quizId}-${item.id}`}
            checked={this.getScaleValueForItem(item.id) === (index + 1)}
            onChange={() => this.props.onScaleChange(item.id, index + 1)}
            disabled={!!this.props.disabled}
          />
        </div>
      ));
  }

  renderSingleItem(item, index) {
    return (
      <div key={item.id} className={withClassPrefix('scale-quiz__item clearfix')}>
        <div className={withClassPrefix('scale-quiz__item-title')}>
          {index + 1}. {item.title}
        </div>

        <div className={withClassPrefix('scale-quiz__item-scales')}>
          {this.renderScales(item)}
        </div>
      </div>
    );
  }

  renderItems() {
    return this.getItems().map((item, index) => this.renderSingleItem(item, index));
  }

  getMinScaleTitle() {
    return lget(this.props.quiz, 'data.meta.minScaleTitle') || 'I strongly disagree';
  }

  getMaxScaleTitle() {
    return lget(this.props.quiz, 'data.meta.maxScaleTitle') || 'I strongly agree';
  }

  renderLegend() {
    return (
      <div className={withClassPrefix('scale-quiz__legend clearfix')}>
        <div className={withClassPrefix('scale-quiz__legend-padding')}>
        </div>

        <div className={withClassPrefix('scale-quiz__legend-content')}>
          <div className={withClassPrefix('text-muted scale-quiz__legend-min-title')}>
            {this.getMinScaleTitle()}
          </div>
          <div className={withClassPrefix('text-muted scale-quiz__legend-max-title')}>
            {this.getMaxScaleTitle()}
          </div>
        </div>
      </div>
    );
  }

  onSubmit() {
    return e => {
      e.preventDefault();

      this.props.onSubmit();
    }
  }

  hasAnsweredEveryItem() {
    return Object.values(lget(this.props.answer, 'data') || {}).length === this.getItems().length;
  }

  render() {
    const isValid = this.hasAnsweredEveryItem();
    const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting;

    return (
      <form onSubmit={this.onSubmit()} className={withClassPrefix('scale-quiz')}>
        <div className={withClassPrefix('form-group')}>
          {this.renderLegend()}
          {this.renderItems()}
        </div>

        <div className={withClassPrefix('form-group')}>
          <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
        </div>
      </form>
    )
  }
}

export default ScaleQuiz;
