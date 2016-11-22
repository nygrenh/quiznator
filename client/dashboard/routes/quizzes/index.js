import React from 'react';
import { connect } from 'react-redux';

import Paginator from 'components/paginator';
import Loader from 'components/loader';
import CreateQuizDropdown from './create-quiz-dropdown';
import CreateQuizModal from './create-quiz-modal';
import QuizzesTable from './quizzes-table';

import { getQuizzesList, updatePage } from 'state/quizzes-list';
import { selectQuizzes, selectCurrentPage, selectTotalPages } from 'selectors/quizzes-list';

class Quizzes extends React.Component {
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
    if(this.props.loading) {
      return <Loader/>;
    } else {
      return (
        <div>
          <QuizzesTable/>
          <Paginator activePage={this.props.currentPage} totalPages={this.props.totalPages} onChange={this.props.onUpdatePage}/>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderTable()}
        <CreateQuizModal/>
      </div>
    )
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
)(Quizzes);
