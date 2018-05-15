import React from 'react';
import { Row, Col } from 'reactstrap';
import _get from 'lodash.get';

import { FormGroup, Label, Input, FormText } from 'reactstrap';

class MultipleOpenQuizEditorMetaEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      regexTest: {},
      rightAnswer: _get(this.props.meta, 'rightAnswer') || {},
      valid: {},
      error: {}
    }
  }

  onRegexTestChange(e, itemId) {
    const regexTest = e.target.value
    const regex = _get(this.state.rightAnswer, itemId) || ''

    this.setState({ 
      regexTest: {
        ...this.state.regexTest,
        [itemId]: regexTest
      } 
    })
  
    this.testRegex(regex, regexTest, itemId)
  }

  testRegex(regex, regexTest, itemId) {
    try {
      let re = new RegExp(regex)
      this.setState({ 
        valid: {
          ...this.state.valid,
          [itemId]: !!re.exec(regexTest.trim().toLowerCase())
        }, 
        error: {
          ...this.state.error,
          [itemId]: false 
        }
      })
    } catch (err) {
      this.setState({ 
        valid: {
          ...this.state.valid,
          [itemId]: false
        }, 
        error: {
          ...this.state.error,
          [itemId]: true 
        }
      })
    }
  }

  onRightAnswerChange(itemId, value) {
    this.setState({ 
      rightAnswer: {
        ...this.state.rightAnswer,
        [itemId]: value 
      }
    })
    this.props.onRightAnswerChange(itemId, value)
    this.testRegex(value, this.state.regexTest, itemId)
  }

  onRegexChange(e) {
    this.props.onRegexChange(e.target.checked)
  }

  isRegex() {
    return _get(this.props.meta, 'regex') || false
  }

  render() {
    return (
      <div>
        <div className="m-b-1">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              checked={this.isRegex()}
              onChange={(e) => this.onRegexChange(e)}
            /> Right answer is a regular expression  
          </label>
        </div>

        {this.props.items.map(item => (
          <div key={item.id}>
            <label><h2>{item.title}</h2></label>

            {this.isRegex() ?
              <div>
                <FormGroup style={{ background: '#EEEEEE', padding: '5px' }}>
                  <Label>Test your regex here</Label>
                    <Input
                      onChange={(e) => this.onRegexTestChange(e, item.id)}
                    />
                    {!!this.state.regexTest[item.id] && !!this.state.rightAnswer[item.id] !== '' ?
                      <FormText>
                        {this.state.valid[item.id] ? 'Correct!' : 
                        (this.state.error[item.id] ? 'Invalid regex!' : 'Incorrect!')}
                      </FormText>
                    : <span>&nbsp;</span>}
                  </FormGroup>
                <hr />
                </div>
              : null}
    
            <FormGroup>
              <label>Right answer</label>
              <Input 
                onChange={e => this.onRightAnswerChange(item.id, e.target.value)} 
                value={_get(this.props, `rightAnswer[${item.id}]`) || ''}/>

              <FormText color="muted">
                The value is case insensitive. {this.isRegex() ?
                <span><br /><small>Don't forget ^ and $ to match the whole answer!</small></span> : null}
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label>Success message</Label>
              <Input 
                onChange={e => this.props.onSuccessMessageChange(item.id, e.target.value)} 
                value={_get(this.props, `meta.successes[${item.id}]`) || ''}/>
            </FormGroup>
  
            <FormGroup>
              <Label>Error message</Label>
              <Input 
                onChange={e => this.props.onErrorMessageChange(item.id, e.target.value)} 
                value={_get(this.props, `meta.errors[${item.id}]`) || ''}/>
            </FormGroup>
          </div>)
        )}
      </div>
    )
  }
}

export default MultipleOpenQuizEditorMetaEditor;
