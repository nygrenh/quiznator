import React from 'react';
import _get from 'lodash.get';

import { FormGroup, Label, Input, FormText } from 'reactstrap';

class OpenQuizEditorMetaEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      regexTest: '',
      rightAnswer: _get(this.props.meta, 'rightAnswer') || '',
      valid: false,
      error: false
    }
  }

  onRegexTestChange(e) {
    const regexTest = e.target.value
    const regex = this.state.rightAnswer

    this.setState({ regexTest })
  
    this.testRegex(regex, regexTest)
  }

  testRegex(regex, regexTest) {
    try {
      let re = new RegExp(regex)
      this.setState({ valid: !!re.exec(regexTest.trim().toLowerCase()), error: false })
    } catch (err) {
      this.setState({ valid: false, error: true })
    }
  }

  onMultiChange(e) {
    this.props.onMultiChange(e.target.checked)
  }

  onRegexChange(e) {
    this.props.onRegexChange(e.target.checked)
  }

  onRightAnswerChange(value) {
    this.setState({ rightAnswer: value })
    this.props.onRightAnswerChange(value)
    this.testRegex(value, this.state.regexTest)
  }

  isMulti() {
    return _get(this.props.meta, 'multi') || false
  }

  isRegex() {
    return _get(this.props.meta, 'regex') || false
  }

  render() {
    return (
      <div>        
        {/*<div className="m-b-1">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input"
              checked={this.isMulti()}
              onChange={(e) => this.onMultiChange(e)}
            /> This quiz can have several right answers (separate by |) <b>NOT IMPLEMENTED</b>
          </label>
        </div>
        */}

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

        {this.isRegex() ?
          <div>
            <FormGroup style={{ background: '#EEEEEE', padding: '5px' }}>
            <Label>Test your regex here</Label>
              <Input
                onChange={(e) => this.onRegexTestChange(e)}
              />
              {!!this.state.regexTest && !!this.state.rightAnswer ?
                <FormText>
                  {this.state.valid ? 'Correct!' : 
                  (this.state.error ? 'Invalid regex!' : 'Incorrect!')}
                </FormText>
              : <span>&nbsp;</span>}
            </FormGroup>
          <hr />
          </div>
          : null}

        <FormGroup>
          <Label>Right answer</Label>
          <Input 
            onChange={e => this.onRightAnswerChange(e.target.value)} 
            value={_get(this.props, 'meta.rightAnswer') || ''}/>

          <FormText color="muted">
            The value is case insensitive. {this.isRegex() ?
            <span><br /><small>Don't forget ^ and $ to match the whole answer!</small></span> : null}
          </FormText>
        </FormGroup>

        <FormGroup>
          <Label>Success message</Label>
          <Input onChange={e => this.props.onSuccessMessageChange(e.target.value)} value={_get(this.props, 'meta.success') || ''}/>
        </FormGroup>

        <FormGroup>
          <Label>Error message</Label>
          <Input onChange={e => this.props.onErrorMessageChange(e.target.value)} value={_get(this.props, 'meta.error') || ''}/>
        </FormGroup>
      </div>
    );
  }
};

export default OpenQuizEditorMetaEditor;
