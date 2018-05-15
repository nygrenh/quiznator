import React from 'react';
import _get from 'lodash.get';

import ItemEditor from 'components/quiz-editor/item-editor';
import MetaEditor from 'components/quiz-editor/meta-editor';
import MultipleOpenQuizEditorMetaEditor from './multiple-open-quiz-editor-meta-editor';

class MultipleOpenQuizEditor extends React.Component {
  onDataItemChange(id, value) {
    this.props.onDataItemChange(id, { title: value });
  }

  onAddDataItem() {
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    this.props.onRemoveDataItem(id);
  }
    
  onRegexChange(regex) {
    this.props.onDataMetaChange({ regex })
  }

  onRightAnswerChange(id, value) {
    this.props.onDataMetaPathChange(['rightAnswer', id], value);
  }
    
  onSuccessMessageChange(id, value) {
    this.props.onDataMetaPathChange(['successes', id], value)
  }

  onErrorMessageChange(id, value) {
    this.props.onDataMetaPathChange(['errors', id], value);
  }

  render() {
    return (
      <div>
        <div className="m-b-1">
          <label>Items</label>

            <ItemEditor 
              items={this.props.items} 
              onAddDataItem={this.onAddDataItem.bind(this)} 
              onDataItemOrderChange={this.props.onDataItemOrderChange} 
              onDataItemChange={this.onDataItemChange.bind(this)} 
              onRemoveDataItem={this.onRemoveDataItem.bind(this)}
            />
        </div>

        <MetaEditor>
            <MultipleOpenQuizEditorMetaEditor
              meta={_get(this.props.quiz, 'data.meta')}
              items={this.props.items} 
              rightAnswer={_get(this.props.quiz, 'data.meta.rightAnswer') || []} 
              onRightAnswerChange={this.onRightAnswerChange.bind(this)}
              onSuccessMessageChange={this.onSuccessMessageChange.bind(this)}
              onErrorMessageChange={this.onErrorMessageChange.bind(this)}
              onRegexChange={this.onRegexChange.bind(this)}
            />
        </MetaEditor>
      </div>
    );
  }
};

export default MultipleOpenQuizEditor;
