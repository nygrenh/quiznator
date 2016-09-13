import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'reactstrap';

import Loader from 'components/loader';
import Icon from 'components/icon';
import CreateQuizDropdown from './create-quiz-dropdown';
import CreateQuizModal from './create-quiz-modal';
import QuizzesTable from './quizzes-table';
import EditQuizModal from './edit-quiz-modal';

import { fetchQuizzesList } from 'state/quizzes-list';

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
        <CreateQuizModal/>
        <EditQuizModal/>
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
  quizzes: state.quizzesList.data,
  loading: !!state.quizzesList.loading
});

const mapDispatchToProps = dispatch => ({
  loadQuizzes: () => dispatch(fetchQuizzesList())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizzesListPage);
