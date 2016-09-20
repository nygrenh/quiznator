import React from 'react';

import withClassPrefix from 'utils/class-prefix';

class SubmitButton extends React.Component {
  getText() {
    return this.props.submitting
      ? 'Submitting...'
      : 'Submit';
  }

  render() {
    return (
      <button type="submit" className={withClassPrefix('btn btn-primary')} disabled={this.props.disabled}>
        {this.getText()}
      </button>
    )
  }
}

SubmitButton.PropTypes = {
  disabled: React.PropTypes.bool,
  submitting: React.PropTypes.bool
}

export default SubmitButton;
