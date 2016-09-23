import React from 'react';
import _get from 'lodash.get';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import ItemEditor from 'components/quiz-editor/item-editor';
import MultipleChoiceQuizEditorMetaEditor from './multiple-choice-quiz-editor-meta-editor';

class MultipleChoiceQuizEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMetaData: false
    }
  }

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

  toggleEditMetaData(e) {
    e.preventDefault();

    const isEditing = this.state.editMetaData;

    this.setState({
      editMetaData: !isEditing
    });
  }

  onSuccessMessageChange(id, value) {
    this.props.onDataMetaPathChange(['successes', id], value);
  }

  onErrorMessageChange(id, value) {
    this.props.onDataMetaPathChange(['errors', id], value);
  }

  renderMetaDataEditor() {
    if(this.state.editMetaData) {
      return (
        <div className="m-t-1">
          <MultipleChoiceQuizEditorMetaEditor meta={_get(this.props.quiz, 'data.meta')} items={this.props.items} rightAnswer={_get(this.props.quiz, 'data.meta.rightAnswer') || []} onRightAnswersChange={this.onRightAnswersChange.bind(this)} onSuccessMessageChange={this.onSuccessMessageChange.bind(this)} onErrorMessageChange={this.onErrorMessageChange.bind(this)}/>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <div className="m-b-1">
          <label>Items</label>

          <ItemEditor items={this.props.items} onAddDataItem={this.onAddDataItem.bind(this)} onDataItemOrderChange={this.props.onDataItemOrderChange} onDataItemChange={this.onDataItemChange.bind(this)} onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
        </div>

        <div>
          <Button color="secondary" onClick={this.toggleEditMetaData.bind(this)} active={this.state.editMetaData}>
            <Icon name="pencil"/> Edit meta data
          </Button>

          {this.renderMetaDataEditor()}
        </div>
      </div>
    )
  }
};

MultipleChoiceQuizEditor.defaultProps = {
  items: []
}

export default MultipleChoiceQuizEditor;
