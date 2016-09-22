import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Table, Tag } from 'reactstrap';

import { typeToLabel } from 'common-constants/quiz-types';
import { selectQuizzes } from 'selectors/quizzes-list';
import { chooseQuizToPublish } from 'state/publish-quiz';

import PublishQuizModal from './publish-quiz-modal';
import Icon from 'components/icon';

class QuizzesTable extends React.Component {
  render() {
    const rows = this.props.quizzes.map(quiz => {
      return (
        <tr key={quiz._id}>
          <td>
            <Link to={`/dashboard/quizzes/${quiz._id}`}>
              {quiz.title}
            </Link>
          </td>
          <td>
            <Tag>{typeToLabel[quiz.type]}</Tag>
          </td>
          <td>{moment(quiz.createdAt).format('D. MMMM YYYY')}</td>
          <td>
            <Button color="secondary" size="sm" onClick={() => this.props.onPublishQuiz(quiz)}>
              <Icon name="code"/> Code
            </Button>
          </td>
        </tr>
      )
    });

    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Created at</th>
              <th>Publish</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>

        <PublishQuizModal/>
      </div>
    )
  }
}

QuizzesTable.propTypes = {
  quizzes: React.PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  quizzes: selectQuizzes(state)
});

const mapDispatchToProps = dispatch => ({
  onPublishQuiz: quiz => dispatch(chooseQuizToPublish(quiz))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizzesTable);
