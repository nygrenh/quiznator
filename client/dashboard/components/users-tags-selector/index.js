import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { fetchTags } from 'state/user';

class UsersTagsSelector extends React.Component {
  componentDidMount() {
    this.props.onFetchTags();
  }

  getUsersTagsOptions() {
    return (this.props.tags || [])
      .map(tag => ({ value: tag, label: tag }));
  }

  render() {
    const { options } = this.props;

    const optionsWithUsersTags = [
      ...(options || []),
      ...this.getUsersTagsOptions()
    ];

    return <Select.Creatable {...this.props} multi={true} options={optionsWithUsersTags}/>
  }
}

const mapStateToProps = state => ({
  tags: state.user.tags
});

const mapDispatchToProps = dispatch => ({
  onFetchTags: () => dispatch(fetchTags())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTagsSelector);
