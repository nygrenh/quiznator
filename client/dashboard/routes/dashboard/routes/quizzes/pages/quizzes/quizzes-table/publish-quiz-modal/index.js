import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import copy from 'copy-to-clipboard';
import delay from 'lodash.delay';

import { togglePublishQuizModal } from 'state/publish-quiz';

import Icon from 'components/icon';
import Alert from 'common-components/alert';

class PublishQuizModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placementSnippetCopied: false,
      quiznatorSnippetCopied: false
    }
  }

  copySnippet(text, targetSnippet) {
    copy(text);

    this.setState({
      [`${targetSnippet}Copied`]: true
    });

    delay(() => {
      this.setState({
        [`${targetSnippet}Copied`]: false
      });
    }, 3000);
  }

  renderContent() {
    const placementSnippet = `<div class="quiznator-plugin" quiz-id="${this.props.quiz._id}"></div>`;
    const quiznatorSnippet = `<script src="${process.env.API_URL}/javascripts/plugin-loader.min.js"></script>`;

    return (
      <div>
        <FormGroup>
          <Label>Place the quiz by adding this snippet</Label>

          <Input type="text" value={placementSnippet} readOnly/>

          <Button color="secondary" className="m-t-1" size="sm" onClick={this.copySnippet.bind(this, placementSnippet, 'placementSnippet')}>
            <Icon name="clipboard"/> {this.state.placementSnippetCopied ? 'Copied' : 'Copy to clipboard'}
          </Button>
        </FormGroup>

        <FormGroup>
          <Label>Set up Quiznator by adding this snippet to the end of your <code>body</code> tag</Label>

          <Input type="text" value={quiznatorSnippet} readOnly/>

          <Button color="secondary" className="m-t-1" size="sm" onClick={this.copySnippet.bind(this, quiznatorSnippet, 'quiznatorSnippet')}>
            <Icon name="clipboard"/> {this.state.quiznatorSnippetCopied ? 'Copied' : 'Copy to clipboard'}
          </Button>
        </FormGroup>

        <Alert type="warning">
          You only need one Quiznator snippet (above) for each page
        </Alert>

        <p>
          You can read more about Quiznator's API in the <a href="https://github.com/rage/quiznator/wiki" target="_blank">wiki</a>.
        </p>
      </div>
    )
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>Publish quiz</ModalHeader>
        <ModalBody>
          {this.props.quiz && this.renderContent()}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.onToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: !!state.publishQuiz.modalIsOpen,
  quiz: state.publishQuiz.quiz
});

const mapDispatchToProps = dispatch => ({
  onToggle: () => dispatch(togglePublishQuizModal())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishQuizModal);
