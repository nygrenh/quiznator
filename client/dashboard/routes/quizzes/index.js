import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import Paginator from 'components/paginator';
import Loader from 'components/loader';
import Icon from 'components/icon';
import QuizzesListFiltersModal from './quizzes-list-filters-modal';
import CreateQuizDropdown from './create-quiz-dropdown';
import CloneQuizzesModal from './clone-quizzes-modal';
import CreateQuizModal from './create-quiz-modal';
import QuizzesTable from './quizzes-table';
import { openModal } from 'state/quizzes-list-filters';
import { fetchQuizzesList, updatePage } from 'state/quizzes-list';
import { selectQuizzes, selectCurrentPage, selectTotalPages } from 'selectors/quizzes-list';

class Quizzes extends React.Component {
  componentDidMount() {
    this.props.onFetchQuizzes();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query !== this.props.location.query) {
      this.props.onFetchQuizzes();
    }
  }

  renderHeader() {
    return (
      <div className="m-b-1 clearfix">
        <div className="pull-right">
          <CreateQuizDropdown className="m-r-1"/>

          <Button
            color="secondary"
            onClick={this.props.onOpenFiltersModal}
          >
            <Icon name="filter" /> Adjust filters
          </Button>
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
        <CreateQuizModal />
        <CloneQuizzesModal />
        <QuizzesListFiltersModal />
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
  onFetchQuizzes: () => dispatch(fetchQuizzesList()),
  onUpdatePage: page => dispatch(updatePage(page)),
  onOpenFiltersModal: () => dispatch(openModal())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quizzes);
