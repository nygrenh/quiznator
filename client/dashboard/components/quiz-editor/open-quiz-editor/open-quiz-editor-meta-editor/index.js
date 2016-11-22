import React from 'react';
import _get from 'lodash.get';

import { FormGroup, Label, Input, FormText } from 'reactstrap';

class OpenQuizEditorMetaEditor extends React.Component {
  render() {
    return (
      <div>
        <FormGroup>
          <Label>Right answer</Label>
          <Input onChange={e => this.props.onRightAnswerChange(e.target.value)} value={_get(this.props, 'meta.rightAnswer') || ''}/>

          <FormText color="muted">
            The value is case insensitive.
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label>Success message</Label>
          <Input onChange={e => this.props.onSuccessMessageChange(e.target.value)} value={_get(this.props, 'meta.success') || ''}/>
        </FormGroup>

        <FormGroup>
          <Label>Error message</Label>
          <Input onChange={e => this.props.onErrorMessageChange(e.target.value)} value={_get(this.props, 'meta.error') || ''}/>
        </FormGroup>
      </div>
    );
  }
};

export default OpenQuizEditorMetaEditor;
