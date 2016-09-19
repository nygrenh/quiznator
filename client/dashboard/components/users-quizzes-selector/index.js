import React from 'react';
import { connect } from 'react-redux';

import { fetchQuizzes, fetchQuiz } from 'state/users-quizzes';

import Select from 'react-select';

class UsersQuizzesSelector extends React.Component {
  mapResponseToOptions(response) {
    return {
      options: response.payload.data.data.map(quiz => ({ value: quiz._id, label: quiz.title })),
      complete: false
    }
  }

  getQuery({ title }) {
    let query = { title: title };

    if(this.props.types) {
      query = Object.assign({}, query, { types: this.props.types });
    }

    return query;
  }

  loadOptions(text, callback) {
    if(!text && this.props.value) {
      this.props.loadQuiz(this.props.value)
        .then(response => {
          if(response.error) {
            callback(response.error);
          } else {
            callback(null, {
              options: [{ value: response.payload.data._id, label: response.payload.data.title }],
              complete: false
            });
          }
        });
    } else {
      this.props.loadQuizzes(this.getQuery({ title: text }))
        .then(response => {
          if(response.error) {
            callback(response.error);
          } else {
            callback(null, this.mapResponseToOptions(response));
          }
        });
    }
  }

  render() {
    return <Select.Async {...this.props} loadOptions={this.loadOptions.bind(this)}/>
  }
}

const mapDispatchToProps = dispatch => ({
  loadQuizzes: query => dispatch(fetchQuizzes(query)),
  loadQuiz: id => dispatch(fetchQuiz(id))
});

export default connect(
  undefined,
  mapDispatchToProps
)(UsersQuizzesSelector);
