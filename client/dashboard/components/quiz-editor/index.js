import React from 'react';
import { Form, FormGroup, Input, Button, FormText, Label } from 'reactstrap';

import { 
  CHECKBOX, 
  ESSAY, 
  MULTIPLE_CHOICE, 
  PEER_REVIEW, 
  PEER_REVIEWS_RECEIVED, 
  OPEN, 
  SCALE, 
  PRIVACY_AGREEMENT,
  RADIO_MATRIX 
} from 'common-constants/quiz-types';

import Alert from 'common-components/alert';
import UsersTagsSelector from 'components/users-tags-selector';
import EssayQuizEditor from './essay-quiz-editor';
import MultipleChoiceQuizEditor from './multiple-choice-quiz-editor';
import PeerReviewQuizEditor from './peer-review-quiz-editor';
import PeerReviewsReceivedQuizEditor from './peer-reviews-received-quiz-editor';
import CheckboxQuizEditor from './checkbox-quiz-editor';
import OpenQuizEditor from './open-quiz-editor';
import ScaleQuizEditor from './scale-quiz-editor';
import PrivacyAgreementEditor from './privacy-agreement-editor';
import RadioMatrixQuizEditor from './radio-matrix-quiz-editor'

const mapQuizTypeToEditor = {
  [ESSAY]: EssayQuizEditor,
  [MULTIPLE_CHOICE]: MultipleChoiceQuizEditor,
  [PEER_REVIEW]: PeerReviewQuizEditor,
  [PEER_REVIEWS_RECEIVED]: PeerReviewsReceivedQuizEditor,
  [CHECKBOX]: CheckboxQuizEditor,
  [PRIVACY_AGREEMENT]: PrivacyAgreementEditor,
  [OPEN]: OpenQuizEditor,
  [SCALE]: ScaleQuizEditor,
  [RADIO_MATRIX]: RadioMatrixQuizEditor
};

class QuizEditor extends React.Component {
  constructor() {
    super();

    this.onBodyChange = this.onBodyChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onStorageKeyChange = this.onStorageKeyChange.bind(this);
    this.onRequiredChange = this.onRequiredChange.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
    this.onPopulateAnswersChange = this.onPopulateAnswersChange.bind(this);
  }

  renderEditorContent() {
    const Component = mapQuizTypeToEditor[this.props.quiz.type];

    if(Component) {
      return <Component {...this.props}/>;
    } else {
      return null;
    }
  }

  onTitleChange(e) {
    this.props.onTitleChange(e.target.value);
  }

  onStorageKeyChange(e) {
    this.props.onStorageKeyChange(e.target.value);
  }

  onRequiredChange(e) {
    this.props.onRequiredChange(e.target.value);
  }

  onBodyChange(e) {
    this.props.onBodyChange(e.target.value);
  }

  onTagsChange(value) {
    this.props.onTagsChange((value || []).map(value => value.value));
  }

  onPopulateAnswersChange(e) {
    this.props.onPopulateAnswersChange(e.target.checked);
  }


  onSave(e) {
    e.preventDefault();

    this.props.onSave();
  }

  render() {
    const { quiz } = this.props;
    const tagOptions = quiz.tags.map(tag => ({ value: tag, label: tag }));

    return (
      <Form>
        <FormGroup>
          <Label>Title</Label>
          <input
            type="text"
            placeholder="Title"
            value={quiz.title}
            className="form-control"
            onChange={this.onTitleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Body</Label>
          <textarea
            placeholder="Body"
            value={quiz.body}
            rows={6}
            className="form-control"
            onChange={this.onBodyChange}
          />

          <FormText color="muted">
            This field supports <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a>.
          </FormText>
        </FormGroup>

        <FormGroup>
          <div className="form-check">
            <label className="form-check-label">
              <input type="checkbox" className="form-check-input" checked={!!quiz.populateAnswers} onChange={this.onPopulateAnswersChange} /> Populate answers
            </label>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <UsersTagsSelector
            name="quiz-tags"
            onChange={this.onTagsChange}
            options={tagOptions}
            value={quiz.tags}
          />
        </FormGroup>

        {this.renderEditorContent()}

        <Button color="primary" className="m-t-1 pull-xs-right" onClick={this.onSave.bind(this)}>
          Save
        </Button>
      </Form>
    );
  }
}

export default QuizEditor;
