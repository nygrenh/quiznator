import React from 'react';
import _get from 'lodash.get';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import ItemEditor from 'components/quiz-editor/item-editor';
import MultipleChoiceQuizEditorMetaEditor from './multiple-choice-quiz-editor-meta-editor';
import MetaEditor from 'components/quiz-editor/meta-editor';

class MultipleChoiceQuizEditor extends React.Component {
  onDataItemChange(id, value) {
    this.props.onDataItemChange(id, { title: value });
  }

  onAddDataItem() {
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    this.props.onRemoveDataItem(id);
  }

  onRightAnswersChange(value) {
    this.props.onDataMetaChange({ rightAnswer: value });
  }

  onSuccessMessageChange(id, value) {
    this.props.onDataMetaPathChange(['successes', id], value);
  }

  onErrorMessageChange(id, value) {
    this.props.onDataMetaPathChange(['errors', id], value);
  }

  render() {
    return (
      <div>
        <div className="m-b-1">
          <label>Items</label>

          <ItemEditor items={this.props.items} onAddDataItem={this.onAddDataItem.bind(this)} onDataItemOrderChange={this.props.onDataItemOrderChange} onDataItemChange={this.onDataItemChange.bind(this)} onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
        </div>

        <MetaEditor>
          <MultipleChoiceQuizEditorMetaEditor meta={_get(this.props.quiz, 'data.meta')} items={this.props.items} rightAnswer={_get(this.props.quiz, 'data.meta.rightAnswer') || []} onRightAnswersChange={this.onRightAnswersChange.bind(this)} onSuccessMessageChange={this.onSuccessMessageChange.bind(this)} onErrorMessageChange={this.onErrorMessageChange.bind(this)}/>
        </MetaEditor>
      </div>
    )
  }
};

MultipleChoiceQuizEditor.defaultProps = {
  items: []
}

export default MultipleChoiceQuizEditor;
