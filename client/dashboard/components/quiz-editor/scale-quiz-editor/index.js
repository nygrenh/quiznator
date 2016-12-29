import React from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import lget from 'lodash.get';

import ItemEditor from 'components/quiz-editor/item-editor';
import MetaEditor from 'components/quiz-editor/meta-editor';
import ScaleQuizEditorMetaEditor from './scale-quiz-editor-meta-editor';

class ScaleQuizEditor extends React.Component {
  onDataItemChange(id, value) {
    this.props.onDataItemChange(id, { title: value });
  }

  onAddDataItem() {
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    this.props.onRemoveDataItem(id);
  }

  onScaleChange(e) {
    const newScale = +e.target.value;

    this.props.onDataChange({ scale: newScale });
  }

  onMinScaleTitleChange(title) {
    this.props.onDataMetaChange({ minScaleTitle: title });
  }

  onMaxScaleTitleChange(title) {
    this.props.onDataMetaChange({ maxScaleTitle: title });
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Label>Scale</Label>
          <Input type="number" value={this.props.quiz.data.scale} onChange={this.onScaleChange.bind(this)}/>
        </FormGroup>

        <div className="m-b-1">
          <label>Items</label>

          <ItemEditor items={this.props.items} onAddDataItem={this.onAddDataItem.bind(this)} onDataItemOrderChange={this.props.onDataItemOrderChange} onDataItemChange={this.onDataItemChange.bind(this)} onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
        </div>

        <MetaEditor>
          <ScaleQuizEditorMetaEditor
            meta={lget(this.props.quiz, 'data.meta')}
            onMinScaleTitleChange={this.onMinScaleTitleChange.bind(this)}
            onMaxScaleTitleChange={this.onMaxScaleTitleChange.bind(this)}
          />
        </MetaEditor>
      </div>
    )
  }
};

ScaleQuizEditor.defaultProps = {
  items: []
};

export default ScaleQuizEditor;
