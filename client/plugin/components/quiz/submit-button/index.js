import React from 'react';
import c from 'classnames';

import withClassPrefix from 'utils/class-prefix';

class SubmitButton extends React.Component {
  getText() {
    return this.props.submitting
      ? 'Submitting...'
      : 'Submit';
  }

  renderHelper() {
    return this.props.submitted
      ? (
        <div className={withClassPrefix('text-muted m-t-1')}>
          You've already submitted this quiz but you can submit it again.
        </div>
      )
      : null;
  }

  render() {
    const buttonClasses = [withClassPrefix('btn btn-primary'), { [withClassPrefix('btn-outline')]: this.props.submitted }];;

    return (
      <div>
        <button type="submit" className={c(buttonClasses)} disabled={this.props.disabled}>
          {this.getText()}
        </button>

        {this.renderHelper()}
      </div>
    )
  }
}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  submitted: React.PropTypes.bool
}

SubmitButton.defaultProps = {
  disabled: false,
  submitted: false,
  submitting: false
}

export default SubmitButton;
