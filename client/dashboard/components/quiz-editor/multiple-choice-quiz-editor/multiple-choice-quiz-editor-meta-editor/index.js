import React from 'react';
import get from 'lodash.get';
import { Row, Col } from 'reactstrap';

import Selector from 'components/selector';

class MultipleChoiceQuizEditorMetaEditor extends React.Component {
  onRightAnswersChange(value) {
    this.props.onRightAnswersChange(value.map(answer => answer.value));
  }

  getWrongItems() {
    return this.props.items.filter(item => this.props.rightAnswer.indexOf(item.id) < 0);
  }

  getRightItems() {
    return this.props.items.filter(item => this.props.rightAnswer.indexOf(item.id) >= 0);
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

  renderErrorMessages() {
    const items = this.getWrongItems();

    if(this.props.rightAnswer.length > 0 && items.length > 0) {
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
    const items = this.getRightItems();

    if(this.props.rightAnswer.length > 0 && items.length > 0) {
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

  render() {
    const options = this.props.items.map(item => ({ value: item.id, label: item.title }));

    return (
      <div>
        <div className="m-b-1">
          <label>Right answers</label>
          <Selector options={options} multi={true} name="meta-right-answers" value={this.props.rightAnswer} onChange={this.onRightAnswersChange.bind(this)}/>
        </div>

        {this.renderErrorMessages()}
        {this.renderSuccessMessages()}
      </div>
    )
  }
}

export default MultipleChoiceQuizEditorMetaEditor;
