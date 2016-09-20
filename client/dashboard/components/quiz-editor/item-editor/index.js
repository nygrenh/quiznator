import React from 'react';
import { Button, FormText } from 'reactstrap';
import Sortable from 'react-sortablejs';

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
      return (
        <ItemEditorItem
          title={item.title}
          id={item.id}
          key={item.id}
          onChange={this.onDataItemChange(item.id)}
          onRemove={this.onRemoveDataItem(item.id)}
        />
      )
    });
  }

  onAddDataItem(e) {
    e.preventDefault();

    this.props.onAddDataItem();
  }

  onDataItemOrderChange(order, sortable, evt) {
    this.props.onDataItemOrderChange(order);
  }

  getSortableProperties() {
    return {
      tag: 'div',
      onChange: this.onDataItemOrderChange.bind(this)
    }
  }

  render() {
    return (
      <div>
        <Sortable {...this.getSortableProperties()}>
          {this.renderItems()}
        </Sortable>

        <FormText color="muted" className="m-b-1">
          You can change the order of the items by dragging them.
        </FormText>

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
