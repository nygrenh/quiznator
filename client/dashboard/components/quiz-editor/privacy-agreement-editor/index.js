import React from 'react';
import _get from 'lodash.get';
import { Button } from 'reactstrap';

import Icon from 'components/icon';
import ItemEditor from 'components/quiz-editor/item-editor';
import PrivacyAgreementItemEditor from './privacy-agreement-item-editor'

class PrivacyAgreementEditor extends React.Component {
  onDataItemChange(id, value) {
    this.props.onDataItemChange(id, { title: value });
  }

  onAddDataItem() {
    this.props.onAddDataItem({ title: '' });
  }

  onRemoveDataItem(id) {
    this.props.onRemoveDataItem(id);
  }

  onStorageKeyChange(id, value) {
    this.props.onDataMetaPathChange(['storageKeys', id], value);
  }

  onRequiredChange(id, value) {
    this.props.onDataMetaPathChange(['required', id], value);
  }

  onErrorMessageChange(id, value) {
    this.props.onDataMetaPathChange(['errors', id], value);
  }

 render() {
    return (
      <div>
        <div className="m-b-1">
          <label>Items</label>

          <PrivacyAgreementItemEditor 
            items={this.props.items}
            type={this.props.quiz.type}
            meta={_get(this.props.quiz, 'data.meta')}
            onAddDataItem={this.onAddDataItem.bind(this)} 
            onDataItemOrderChange={this.props.onDataItemOrderChange} 
            onDataItemChange={this.onDataItemChange.bind(this)} 
            onStorageKeyChange={this.onStorageKeyChange.bind(this)} 
            onRequiredChange={this.onRequiredChange.bind(this)}
            onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
        </div>

      </div>
    )
  }
};

PrivacyAgreementEditor.defaultProps = {
  items: []
}

export default PrivacyAgreementEditor;
