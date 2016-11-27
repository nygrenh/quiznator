import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { toggleModal, applyFilters } from 'state/quizzes-list-filters';
import Icon from 'components/icon';
import TagFiltersSelector from './tag-filters-selector';

class QuizzesListFiltersModal extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>
          Search filters
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>
              Tags
            </Label>
            <TagFiltersSelector />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            className="m-r-1"
            onClick={this.props.onToggle}
          >
            Close
          </Button>
          <Button
            color="primary"
            onClick={this.props.applyFilters}
          >
            <Icon name="search" /> Search
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.quizzesListFilters.modalIsOpen
});

const mapDispatchToProps = dispatch => ({
  onToggle: () => dispatch(toggleModal()),
  applyFilters: () => dispatch(applyFilters())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizzesListFiltersModal);
