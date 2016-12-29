import React from 'react';
import lget from 'lodash.get';

import { FormGroup, Label, Input, FormText } from 'reactstrap';

class ScaleQuizEditorMetaEditor extends React.Component {
  render() {
    return (
      <div>
        <FormGroup>
          <Label>Minimum scale title</Label>
          <Input onChange={e => this.props.onMinScaleTitleChange(e.target.value)} value={lget(this.props, 'meta.minScaleTitle') || ''}/>
        </FormGroup>

        <FormGroup>
          <Label>Maximum scale title</Label>
          <Input onChange={e => this.props.onMaxScaleTitleChange(e.target.value)} value={lget(this.props, 'meta.maxScaleTitle') || ''}/>
        </FormGroup>
      </div>
    );
  }
};

export default ScaleQuizEditorMetaEditor;
