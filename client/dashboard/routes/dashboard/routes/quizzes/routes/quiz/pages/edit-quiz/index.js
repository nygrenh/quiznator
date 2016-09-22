import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

import { saveQuiz, fetchQuiz, updateQuiz, updateData, addDataItem, updateDataItem, removeDataItem, updateDataMeta, setDataMetaPath } from 'state/quizzes';
import { quizSelector, quizItemsSelector, quizMetaSelector } from 'selectors/quizzes';

import Loader from 'components/loader';
import QuizEditor from 'components/quiz-editor';

class EditQuiz extends React.Component {
  componentDidMount() {
    this.props.loadQuiz();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.id !== this.props.params.id) {
      this.props.loadQuiz();
    }
  }

  render() {
    if(this.props.loading) {
      return <Loader/>;
    } else if(this.props.quiz) {
      return <QuizEditor {...omit(this.props, ['loading', 'loadQuiz'])}/>
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const quizId = ownProps.params.id;

  const quiz = quizSelector(state, quizId);
  const loading = !!(quizMetaSelector(state, quizId) || {}).loading;
  const items = quizItemsSelector(state, quizId);

  return { quiz, items, loading }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const quizId = ownProps.params.id;

  return {
    loadQuiz: () => dispatch(fetchQuiz(quizId)),
    onTitleChange: title => dispatch(updateQuiz(quizId, { title })),
    onBodyChange: body => dispatch(updateQuiz(quizId, { body })),
    onExpiresAtChange: expiresAt => dispatch(updateQuiz(quizIdd, { expiresAt })),
    onDataItemChange: (itemId, update) => dispatch(updateDataItem(quizId, itemId, update)),
    onRemoveDataItem: itemId => dispatch(removeDataItem(quizId, itemId)),
    onDataChange: update => dispatch(updateData(quizId, update)),
    onAddDataItem: item => dispatch(addDataItem(quizId, item)),
    onDataItemOrderChange: order => dispatch(updateData(quizId, { items: order })),
    onDataMetaChange: update => dispatch(updateDataMeta(quizId, update)),
    onDataMetaPathChange: (path, value) => dispatch(setDataMetaPath(quizId, path, value)),
    onSave: () => dispatch(saveQuiz(quizId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQuiz);
