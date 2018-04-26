import React from 'react';
import { FormText } from 'reactstrap'
import MetaEditor from 'components/quiz-editor/meta-editor';

class EssayQuizEditor extends React.Component {
  onMinWordsChange(e) {
    this.props.onDataMetaPathChange(['minWords'], +e.target.value);
  }

  onMaxWordsChange(e) {
    this.props.onDataMetaPathChange(['maxWords'], +e.target.value);
  }

  onSubmitMessageChange(e) {
    this.props.onDataMetaPathChange(['submitMessage'], e.target.value)
  }

  hasMeta() {
    return this.props.quiz && this.props.quiz.data && this.props.quiz.data.meta;
  }

  getMinWords() {
    return this.hasMeta() && this.props.quiz.data.meta.minWords
      ? this.props.quiz.data.meta.minWords
      : null;
  }

  getMaxWords() {
    return this.hasMeta() && this.props.quiz.data.meta.maxWords
      ? this.props.quiz.data.meta.maxWords
      : null;
  }

  getSubmitMessage() {
    return this.hasMeta() && this.props.quiz.data.meta.submitMessage
      ? this.props.quiz.data.meta.submitMessage
      : null
  }

  render() {
    return (
      <MetaEditor>
        <div className="form-group">
          <label>Preferred word count</label>
          <div className="row">
            <div className="col-md-6">
              <input type="number" value={this.getMinWords()} className="form-control" placeholder="Min words" onChange={this.onMinWordsChange.bind(this)} />
            </div>

            <div className="col-md-6">
              <input type="number" value={this.getMaxWords()} className="form-control" placeholder="Max words" onChange={this.onMaxWordsChange.bind(this)} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Message to display after submitting</label>
          <div className="row">
            <textarea type="text" rows={6} value={this.getSubmitMessage()} className="form-control" placeholder="Leave empty for no message" onChange={this.onSubmitMessageChange.bind(this)}>
            </textarea>
         </div>
         <FormText color="muted">
         This field supports <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a>.
         </FormText>

        </div>
      </MetaEditor>
    );
  }
};

export default EssayQuizEditor;
