import React from 'react';
import { connect } from 'react-redux';

import Paginator from 'components/paginator';
import Loader from 'components/loader';
import CreateQuizDropdown from './create-quiz-dropdown';
import CreateQuizModal from './create-quiz-modal';
import QuizzesTable from './quizzes-table';

import { getQuizzesList, updatePage } from 'state/quizzes-list';
import { selectQuizzes, selectCurrentPage, selectTotalPages } from 'selectors/quizzes-list';

class QuizzesListPage extends React.Component {
  componentDidMount() {
    this.props.loadQuizzes();
  }

  renderHeader() {
    return (
      <div className="m-b-1 clearfix">
        <div className="pull-right">
          <CreateQuizDropdown/>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <div>
        {this.renderHeader()}
        <QuizzesTable quizzes={this.props.quizzes}/>
        <Paginator activePage={this.props.currentPage} totalPages={this.props.totalPages} onChange={this.props.onUpdatePage}/>
        <CreateQuizModal/>
      </div>
    )
  }

  render() {
    if(this.props.loading) {
      return <Loader/>
    } else if(this.props.quizzes) {
      return this.renderTable();
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  quizzes: selectQuizzes(state),
  totalPages: selectTotalPages(state),
  currentPage: selectCurrentPage(state),
  loading: !!state.quizzesList.loading
});

const mapDispatchToProps = dispatch => ({
  loadQuizzes: () => dispatch(getQuizzesList()),
  onUpdatePage: page => dispatch(updatePage(page))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizzesListPage);
