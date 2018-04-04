import React from 'react';
import { Button } from 'reactstrap';

import Icon from 'components/icon';

import ItemEditorItem from 'components/quiz-editor/item-editor/item-editor-item';
import _get from 'lodash.get'

class PrivacyAgreementEditorItem extends React.Component {
    onStorageKeyChange() {
        this.props.onStorageKeyChange(this.refs.storageKey.value);
      }
    
    onRequiredChange() {
        this.props.onRequiredChange(this.refs.required.checked);
    }
    
    renderPrivacyAgreementFields() {
        return (
          <div className="display-flex m-b-1" data-id={this.props.id}>
            <div className="flex-1">
              <input type="text" className="form-control" 
                onChange={this.onStorageKeyChange.bind(this)} 
                value={this.props.storageKey} 
                ref="storageKey" 
                placeholder="Storage key" />
            </div>
            <div className="flex-0 p-l-1">
                <label>
                  <input type="checkbox" className="formControl" 
                  onChange={this.onRequiredChange.bind(this)} 
                  checked={this.props.required} 
                  ref="required" 
                  placeholder="Required" />
                  <p>Required</p>
              </label>
            </div>
          </div>
        );
      }

    render() {
        return (
            <ItemEditorItem {...this.props}>
                {this.renderPrivacyAgreementFields()}
            </ItemEditorItem>
        )
    }
}

export default PrivacyAgreementEditorItem;