import React from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';

import { ESSAY, MULTIPLE_CHOICE, PEER_REVIEW, PEER_REVIEWS_RECEIVED } from 'common-constants/quiz-types';

import EssayQuizEditor from './essay-quiz-editor';
import MultipleChoiceQuizEditor from './multiple-choice-quiz-editor';
import PeerReviewQuizEditor from './peer-review-quiz-editor';
import PeerReviewsReceivedQuizEditor from './peer-reviews-received-quiz-editor';

const mapQuizTypeToEditor = {
  [ESSAY]: EssayQuizEditor,
  [MULTIPLE_CHOICE]: MultipleChoiceQuizEditor,
  [PEER_REVIEW]: PeerReviewQuizEditor,
  [PEER_REVIEWS_RECEIVED]: PeerReviewsReceivedQuizEditor
}

class QuizEditor extends React.Component {
  renderEditorContent() {
    const Component = mapQuizTypeToEditor[this.props.quiz.type];

    if(Component) {
      return <Component {...this.props}/>;
    } else {
      return null;
    }
  }

  onTitleChange() {
    this.props.onTitleChange(this.refs.title.value);
  }

  onBodyChange() {
    this.props.onBodyChange(this.refs.body.value);
  }

  onSave(e) {
    e.preventDefault();

    this.props.onSave();
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <label>Title</label>
          <input type="text" placeholder="Title" value={this.props.quiz.title} className="form-control" ref="title" onChange={this.onTitleChange.bind(this)}/>
        </FormGroup>

        <FormGroup>
          <label>Body</label>
          <textarea placeholder="Body" ref="body" value={this.props.quiz.body} rows={4} className="form-control" onChange={this.onBodyChange.bind(this)}></textarea>
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
