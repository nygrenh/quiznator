import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

import { saveQuiz, fetchQuiz, updateQuiz, updateData, addDataItem, updateDataItem, removeDataItem, updateDataMeta, setDataMetaPath } from 'state/edit-quiz';
import { quizSelector, quizItemsSelector } from 'selectors/edit-quiz';

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
      return <QuizEditor {...omit(this.props, ['loading', 'loadQuiz'])}/>
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  quiz: quizSelector(state),
  items: quizItemsSelector(state),
  loading: !!state.editQuiz.loading
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadQuiz: () => dispatch(fetchQuiz(ownProps.params.id)),
  onTitleChange: title => dispatch(updateQuiz({ title })),
  onBodyChange: body => dispatch(updateQuiz({ body })),
  onExpiresAtChange: expiresAt => dispatch(updateQuiz({ expiresAt })),
  onDataItemChange: (id, update) => dispatch(updateDataItem(id, update)),
  onRemoveDataItem: id => dispatch(removeDataItem(id)),
  onDataChange: update => dispatch(updateData(update)),
  onAddDataItem: item => dispatch(addDataItem(item)),
  onDataItemOrderChange: order => dispatch(updateData({ items: order })),
  onDataMetaChange: update => dispatch(updateDataMeta(update)),
  onDataMetaPathChange: (path, value) => dispatch(setDataMetaPath(path, value)),
  onSave: () => dispatch(saveQuiz())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditQuizPage);
