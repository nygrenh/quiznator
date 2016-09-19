import React from 'react';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import ItemEditorItem from './item-editor-item';

class ItemEditor extends React.Component {
  onDataItemChange(id) {
    return value => this.props.onDataItemChange(id, value);
  }

  onRemoveDataItem(id) {
    return () => this.props.onRemoveDataItem(id);
  }

  renderItems() {
    return this.props.items.map(item => {
      return <ItemEditorItem title={item.title} key={item.id} onChange={this.onDataItemChange(item.id)} onRemove={this.onRemoveDataItem(item.id)}/>
    });
  }

  onAddDataItem(e) {
    e.preventDefault();

    this.props.onAddDataItem();
  }

  render() {
    return (
      <div>
        {this.renderItems()}

        <div>
          <Button color="success" onClick={this.onAddDataItem.bind(this)}>
            <Icon name="plus"/> Add an item
          </Button>
        </div>
      </div>
    )
  }
}

export default ItemEditor;
