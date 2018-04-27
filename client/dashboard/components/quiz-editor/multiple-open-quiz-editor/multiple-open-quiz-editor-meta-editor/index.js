import React from 'react';
import { Row, Col } from 'reactstrap';
import _get from 'lodash.get';

import { FormGroup, Label, Input, FormText } from 'reactstrap';

class MultipleOpenQuizEditorMetaEditor extends React.Component {
  render() {
    return (
      <div>
        {this.props.items.map(item =>
          <div key={item.id}>
            <label>{item.title}</label>
            <FormGroup>
              <label>Right answer</label>
              <Input 
                onChange={e => this.props.onRightAnswerChange(item.id, e.target.value)} 
                value={_get(this.props, `rightAnswer[${item.id}]`) || ''}/>

              <FormText color="muted">
                The value is case insensitive.
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label>Success message</Label>
              <Input 
                onChange={e => this.props.onSuccessMessageChange(item.id, e.target.value)} 
                value={_get(this.props, `meta.successes[${item.id}]`) || ''}/>
            </FormGroup>
  
            <FormGroup>
              <Label>Error message</Label>
              <Input 
                onChange={e => this.props.onErrorMessageChange(item.id, e.target.value)} 
                value={_get(this.props, `meta.errors[${item.id}]`) || ''}/>
            </FormGroup>
          </div>
        )}
      </div>
    )
  }
}

export default MultipleOpenQuizEditorMetaEditor;
