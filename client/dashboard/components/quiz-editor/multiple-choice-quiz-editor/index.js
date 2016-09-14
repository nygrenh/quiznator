import React from 'react';
import get from 'lodash.get';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import Selector from 'components/selector';
import MultipleChoiceQuizEditorItem from './multiple-choice-quiz-editor-item';
import MultipleChoiceQuizEditorMetaEditor from './multiple-choice-quiz-editor-meta-editor';

class MultipleChoiceQuizEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMetaData: false
    }
  }

  onDataItemChange(id) {
    return value => {
      this.props.onDataItemChange(id, { title: value });
    }
  }

  onAddDataItem(e) {
    e.preventDefault();
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    return () => this.props.onRemoveDataItem(id);
  }

  renderItems() {
    return this.props.items.map(item => {
      return <MultipleChoiceQuizEditorItem title={item.title} key={item.id} onChange={this.onDataItemChange(item.id)} onRemove={this.onRemoveDataItem(item.id)}/>
    });
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
          <MultipleChoiceQuizEditorMetaEditor meta={get(this.props.quiz, 'data.meta')} items={this.props.items} rightAnswer={get(this.props.quiz, 'data.meta.rightAnswer') || []} onRightAnswersChange={this.onRightAnswersChange.bind(this)} onSuccessMessageChange={this.onSuccessMessageChange.bind(this)} onErrorMessageChange={this.onErrorMessageChange.bind(this)}/>
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
          {this.renderItems()}

          <div>
            <Button color="success" onClick={this.onAddDataItem.bind(this)}>
              <Icon name="plus"/> Add an item
            </Button>
          </div>
        </div>

        <div>
          <Button color="secondary" onClick={this.toggleEditMetaData.bind(this)}>
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
