import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Table, Tag } from 'reactstrap';

import { typeToLabel } from 'common-constants/quiz-types';
import { startEditingQuiz } from 'state/edit-quiz';

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
            <Button color="secondary" size="sm">
              <Icon name="code"/> Code
            </Button>
          </td>
        </tr>
      )
    });

    return (
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
    )
  }
}

QuizzesTable.propTypes = {
  quizzes: React.PropTypes.array.isRequired
}


export default QuizzesTable;
