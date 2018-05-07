import React from 'react';
import { Row, Col } from 'reactstrap';
import _get from 'lodash/get'

import Selector from 'components/selector';

class RadioMatrixQuizEditorMetaEditor extends React.Component {

  onRightAnswersChange(id, value) {
    let newAnswer = this.props.rightAnswer
    newAnswer[id] = value.map(answer => answer.value) || []
    this.props.onRightAnswersChange(newAnswer)
  }

  onMultiChange(e) {
    this.props.onMultiChange(e.target.checked)
  }

  getWrongChoices(itemId) {
    return this.props.choices.filter(choice => this.getRightAnswers(itemId).indexOf(choice.id) < 0);
  }

  getRightChoices(itemId) {
    return this.props.choices.filter(choice => this.getRightAnswers(itemId).indexOf(choice.id) >= 0);
  }

  getRightAnswers(itemId) {
      return _get(this.props.rightAnswer, `[${itemId}`) || []
  }

  isMulti() {
    return _get(this.props.meta, 'multi') || false
  }

  renderMessageItems(items, values = {}, onChange) {
    return items
      .map(item => {
        return (
          <Row key={item.id} className="m-b-1">
            <Col md={4}>
              {item.title}
            </Col>
            <Col md={8}>
              <input type="text" className="form-control" onChange={e => onChange(item.id, e.target.value)} value={values[item.id]}/>
            </Col>
          </Row>
        )
      });
  }

  renderErrorMessages(itemId) {
    const items = this.props.items;

    if(Object.keys(this.props.rightAnswer).length > 0 && items.length > 0) {
      return (
        <div className="m-b-1">
          <label>Error messages</label>
          {this.renderMessageItems(items, (this.props.meta || {}).errors, this.props.onErrorMessageChange)}
        </div>
      )
    } else {
      return null;
    }
  }

  renderSuccessMessages() {
    const items = this.props.items;

    if(Object.keys(this.props.rightAnswer).length > 0 && items.length > 0) {
      return (
        <div className="m-b-1">
          <label>Success messages</label>
          {this.renderMessageItems(items, (this.props.meta || {}).successes, this.props.onSuccessMessageChange)}
        </div>
      )
    } else {
      return null;
    }
  }

  renderItem(item) {
    const options = this.props.choices.map(choice => ({ itemId: item.id, value: choice.id, label: choice.title }));

    return (
      <div key={item.id}>
        <div className="m-b-1">
          <label>Right answers for {item.title}</label>
          <Selector 
            options={options} 
            multi={true}
            ref={`meta-right-answers-${item.id}`} 
            name="meta-right-answers" 
            value={this.props.rightAnswer[item.id]} 
            onChange={(value) => this.onRightAnswersChange(item.id, value)}/>
        </div>

      </div>
    )
  }

  render() {
    const items = this.props.items //.map(item => ({ value: item.id, label: item.title }));

    return (
      <div>
        <div className="m-b-1">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              checked={this.isMulti()}
              onChange={(e) => this.onMultiChange(e)}
            /> Permit multiple answers per item
          </label>
        </div>
        <div className="m-b-1">
          {items.map(item => this.renderItem(item))}
        </div>

        {this.renderErrorMessages()}
        {this.renderSuccessMessages()}
      </div>
    )
  }
}

export default RadioMatrixQuizEditorMetaEditor;
