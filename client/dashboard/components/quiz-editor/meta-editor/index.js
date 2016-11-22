import React from 'react';

import { Button } from 'reactstrap';
import Icon from 'components/icon';

class MetaEditor extends React.Component {
  constructor() {
    super();

    this.state = {
      editMetaData: false
    };
  }

  toggleEditMetaData(e) {
    e.preventDefault();

    const isEditing = this.state.editMetaData;

    this.setState({
      editMetaData: !isEditing
    });
  }

  renderMetaDataEditor() {
    if(this.state.editMetaData) {
      return (
        <div className="m-t-1">
          {this.props.children}
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <Button color="secondary" onClick={this.toggleEditMetaData.bind(this)} active={this.state.editMetaData}>
          <Icon name="pencil"/> Edit meta data
        </Button>

        {this.renderMetaDataEditor()}
      </div>
    );
  }
}

export default MetaEditor;
