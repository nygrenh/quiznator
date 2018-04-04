import React from 'react';
import { Row, Col } from 'reactstrap';

import Selector from 'components/selector';

//// TODO: OBSOLETE?
class PrivacyAgreementEditorMetaEditor extends React.Component {

    onRequiredChange(value) {
        this.props.onRequiredChange(value.map(answer => answer.value)) // TODO
    }

  onStorageKeyChange(id, value) {
    this.props.onStorageKeyChange(id, !!value ? value.map(storageKey => storageKey.value) : {});
  }

  getRequired() {
      return this.props.items.filter(item => this.props.required.indexOf(item.id) >= 0);
  }

  renderRequiredItems(items, values = {}, onChange) {
      return items
        .map(item => {
            return (
                <Row key={item.id} className="m-b-1">
                    <Col md={4}>
                        {item.title}
                    </Col>
                    <Col md={8}>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={e => onChange(item.id, e.target.value)} 
                            value={values[item.id]} />
                    </Col>
                    <Col md={2}>
                        <input 
                            type="checkbox" 
                            className="form-control" 
                            onChange={e => onChange(item.id, e.targetValue)} 
                            checked={values[item.id]} />
                    </Col>
                </Row>
            )
        })
  }

  renderStorageKeys() {
      const items = this.getRequired();

      if (this.props.storageKeys.length > 0 && items.length > 0) {
          return(
              <div className="m-b-1">
                <label>Storage keys</label>
                {this.renderRequiredItems(
                    items, 
                    (this.props.meta || {}).storageKeys, 
                    this.props.onStorageKeyChange)}
              </div>
          )
      }
  }

/*   renderErrorMessages() {
    const items = this.getWrongItems();

    if(this.props.rightAnswer.length > 0 && items.length > 0) {
      return (
        <div className="m-b-1">
          <label>Error messages</label>
          {this.renderMessageItems(items, (this.props.meta || {}).errors, this.props.onErrorMessageChange)}
        </div>
      )
    } else {
      return null;
    }
  }

  renderSuccessMessages() {
    const items = this.getRightItems();

    if(this.props.rightAnswer.length > 0 && items.length > 0) {
      return (
        <div className="m-b-1">
          <label>Success messages</label>
          {this.renderMessageItems(items, (this.props.meta || {}).successes, this.props.onSuccessMessageChange)}
        </div>
      )
    } else {
      return null;
    }
  }
 */

 
  render() {
    const options = this.props.items.map(item => ({ value: item.id, label: item.title }));

    return (
      <div>
        <div className="m-b-1">
          <label>Storage keys</label>
          <Selector 
            options={options} 
            multi={true} 
            name="meta-storage-keys" 
            value={this.props.storageKeys} 
            onChange={this.onStorageKeyChange.bind(this)}/>
        </div>

        {this.renderStorageKeys()}
      </div>
    )
  }
}

export default PrivacyAgreementEditorMetaEditor;
