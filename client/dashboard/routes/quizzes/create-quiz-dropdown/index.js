import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { chooseQuizType, toggleModal as toggleCreateQuizModal } from 'state/create-quiz';
import { toggleModal as toggleCloneQuizzesModal } from 'state/clone-quizzes'
import { typeToLabel } from 'common-constants/quiz-types';
import Icon from 'components/icon';

class CreateQuizDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleMenu() {
    const isOpen = this.state.isOpen;

    this.setState({
      isOpen: !isOpen
    });
  }

  renderItems() {
    return Object.keys(typeToLabel)
      .map(type => {
        return (
          <DropdownItem onClick={() => this.props.onChooseType(type)} key={type}>
            {typeToLabel[type]}
          </DropdownItem>
        )
      });
  }

  render() {
    return (
      <Dropdown
        isOpen={this.state.isOpen}
        toggle={this.toggleMenu.bind(this)}
        className={`${this.props.className || ''} create-quiz-dropdown`}
      >
        <DropdownToggle caret color="success">
          <Icon name="plus"/> New quiz
        </DropdownToggle>
        <DropdownMenu>
          {this.renderItems()}
          <DropdownItem divider/>
          <DropdownItem onClick={this.props.onChooseCloning}>
            Clone existing quizzes
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onChooseType: type => {
    dispatch(chooseQuizType(type));
    dispatch(toggleCreateQuizModal());
  },
  onChooseCloning: () => dispatch(toggleCloneQuizzesModal())
});

CreateQuizDropdown.propTypes = {
  onChooseType: React.PropTypes.func.isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(CreateQuizDropdown);
