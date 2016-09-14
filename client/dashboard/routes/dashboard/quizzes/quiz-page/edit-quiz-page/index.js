import React from 'react';
import { connect } from 'react-redux';

import { fetchQuiz, updateQuiz, addDataItem } from 'state/edit-quiz';
import { targetQuizSelector } from 'selectors/edit-quiz';

import Loader from 'components/loader';
import QuizEditor from 'components/quiz-editor';

class EditQuizPage extends React.Component {
  componentDidMount() {
    this.props.loadQuiz();
  }

  render() {
    if(this.props.loading) {
      return <Loader/>;
    } else if(this.props.quiz) {
      return <QuizEditor quiz={this.props.quiz} onTitleChange={this.props.onTitleChange} onBodyChange={this.props.onBodyChange}/>
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  quiz: targetQuizSelector(state),
  loading: !!state.editQuiz.loading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadQuiz: () => dispatch(fetchQuiz(ownProps.params.id)),
  onTitleChange: title => dispatch(updateQuiz({ title })),
  onBodyChange: body => {
    dispatch(updateQuiz({ body }))
    dispatch(addDataItem({ value: 1 }))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQuizPage);
