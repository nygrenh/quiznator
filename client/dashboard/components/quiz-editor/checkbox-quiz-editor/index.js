import React from 'react';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import ItemEditor from 'components/quiz-editor/item-editor';

class CheckboxQuizEditor extends React.Component {
  onDataItemChange(id, value) {
    this.props.onDataItemChange(id, { title: value });
  }

  onAddDataItem() {
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    this.props.onRemoveDataItem(id);
  }

  render() {
    return (
      <div>
        <label>Items</label>

        <ItemEditor items={this.props.items} onAddDataItem={this.onAddDataItem.bind(this)} onDataItemChange={this.onDataItemChange.bind(this)} onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
      </div>
    )
  }
};

CheckboxQuizEditor.defaultProps = {
  items: []
}

export default CheckboxQuizEditor;
