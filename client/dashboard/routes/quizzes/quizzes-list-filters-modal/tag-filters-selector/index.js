import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { setTags } from 'state/quizzes-list-filters';
import UsersTagsSelector from 'components/users-tags-selector';

class TagFiltersSelector extends React.Component {
  constructor() {
    super();

    this.onTagsChange = this.onTagsChange.bind(this);
  }

  onTagsChange(newValue) {
    this.props.onChange(newValue.map(value => value.value));
  }

  render() {
    const options = (this.props.tags || [])
      .map(tag => ({ value: tag, label: tag }));

    return (
      <UsersTagsSelector
        name="tag-filters"
        onChange={this.onTagsChange}
        options={options}
        value={this.props.tags}
      />
    );
  }
}

const mapStateToProps = state => ({
  tags: state.quizzesListFilters.tags
});

const mapDispatchToProps = dispatch => ({
  onChange: tags => dispatch(setTags(tags))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFiltersSelector);
