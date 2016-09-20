import React from 'react';
import { Button } from 'reactstrap';

import Icon from 'components/icon';

class ItemEditorItem extends React.Component {
  onTitleChange() {
    this.props.onChange(this.refs.title.value);
  }

  onRemove(e) {
    e.preventDefault();
    this.props.onRemove();
  }

  render() {
    return (
      <div className="display-flex m-b-1" data-id={this.props.id}>
        <div className="flex-1">
          <input type="text" className="form-control" onChange={this.onTitleChange.bind(this)} value={this.props.title} ref="title" placeholder="Title"/>
        </div>

        <div className="flex-0 p-l-1">
          <Button color="danger" onClick={this.onRemove.bind(this)}>
            <Icon name="trash"/> Remove
          </Button>
        </div>
      </div>
    )
  }
}

export default ItemEditorItem;
