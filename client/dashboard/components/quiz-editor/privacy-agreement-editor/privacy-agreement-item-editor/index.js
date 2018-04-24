import React from 'react';
import { Button, FormText } from 'reactstrap';
import Sortable from 'react-sortablejs';
import ItemEditor from 'components/quiz-editor/item-editor'
import Icon from 'components/icon';
import PrivacyAgreementEditorItem from './privacy-agreement-editor-item'
import _get from 'lodash.get'

class PrivacyAgreementItemEditor extends React.Component {
    onDataItemChange(id) {
        return value => this.props.onDataItemChange(id, value);
    }
    
    onRemoveDataItem(id) {
        return () => this.props.onRemoveDataItem(id);
    }
    
    onStorageKeyChange(id) {
        return value => this.props.onStorageKeyChange(id, value);
    }
    
    onRequiredChange(id) {
        return value => this.props.onRequiredChange(id, value);
    }
    
      renderItems() {
        return this.props.items.map(item => {
            return (
            <PrivacyAgreementEditorItem
              title={item.title}
              id={item.id}
              key={item.id}
              type={this.props.type}
              //meta={this.props.meta}
              storageKey={_get(this.props, `meta.storageKeys[${item.id}`)}
              required={_get(this.props, `meta.required[${item.id}]`)}
              onChange={this.onDataItemChange(item.id)}
              onRemove={this.onRemoveDataItem(item.id)}
              onStorageKeyChange={this.onStorageKeyChange(item.id)}
              onRequiredChange={this.onRequiredChange(item.id)}
            />
          )
        });
      }

      render() {
        return(
            <ItemEditor {...this.props}>
                {this.renderItems()}
            </ItemEditor>
        )
    }
}

export default PrivacyAgreementItemEditor;