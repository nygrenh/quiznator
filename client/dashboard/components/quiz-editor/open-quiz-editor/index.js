import React from 'react';
import _get from 'lodash.get';

import MetaEditor from 'components/quiz-editor/meta-editor';
import OpenQuizEditorMetaEditor from './open-quiz-editor-meta-editor';

class OpenQuizEditor extends React.Component {
  onRightAnswerChange(rightAnswer) {
    this.props.onDataMetaChange({ rightAnswer });
  }

  onSuccessMessageChange(success) {
    this.props.onDataMetaChange({ success })
  }

  onErrorMessageChange(error) {
    this.props.onDataMetaChange({ error });
  }

  render() {
    return (
      <div>
        <MetaEditor>
          <OpenQuizEditorMetaEditor
            meta={_get(this.props.quiz, 'data.meta')}
            onRightAnswerChange={this.onRightAnswerChange.bind(this)}
            onSuccessMessageChange={this.onSuccessMessageChange.bind(this)}
            onErrorMessageChange={this.onErrorMessageChange.bind(this)}
          />
        </MetaEditor>
      </div>
    );
  }
};

export default OpenQuizEditor;
