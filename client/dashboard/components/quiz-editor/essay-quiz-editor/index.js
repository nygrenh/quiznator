import React from 'react';

import MetaEditor from 'components/quiz-editor/meta-editor';

class EssayQuizEditor extends React.Component {
  onMinWordsChange(e) {
    this.props.onDataMetaPathChange(['minWords'], +e.target.value);
  }

  onMaxWordsChange(e) {
    this.props.onDataMetaPathChange(['maxWords'], +e.target.value);
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
      </MetaEditor>
    );
  }
};

export default EssayQuizEditor;
