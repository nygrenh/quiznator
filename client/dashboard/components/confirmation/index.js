import React from 'react';
import omit from 'lodash.omit';
import { Popover, PopoverTitle, PopoverContent, ButtonGroup, Button } from 'reactstrap';

import Icon from 'components/icon';

const confirmation = options => Component => class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverIsOpen: false
    }
  }

  onAction() {
    this.setState({
      popoverIsOpen: true
    });
  }

  onDecline(e) {
    e.preventDefault();

    this.setState({
      popoverIsOpen: false
    });
  }

  onAccept(e) {
    e.preventDefault();

    this.setState({
      popoverIsOpen: false
    });

    this.props.onConfirm();
  }

  togglePopover() {
    const popoverIsOpen = !this.state.popoverIsOpen;

    this.setState({
      popoverIsOpen
    });
  }

  renderPopover() {
    return (
      <Popover placement="bottom" isOpen={this.state.popoverIsOpen} target={this.props.id} toggle={this.togglePopover.bind(this)}>
        <PopoverTitle>Are you sure about that?</PopoverTitle>
        <PopoverContent>
          <div className="text-xs-center">
            <ButtonGroup>
              <Button color="success" size="sm" onClick={this.onAccept.bind(this)}>
                <Icon name="check"/> Yes
              </Button>
              <Button color="danger" size="sm" onClick={this.onDecline.bind(this)}>
                <Icon name="times"/> No
              </Button>
            </ButtonGroup>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  render() {
    return (
      <div className="display-inline-block">
        <Component {...omit(this.props, ['onConfirm'])} onClick={this.onAction.bind(this)}/>

        {this.renderPopover()}
      </div>
    );
  }
}

export default confirmation;
