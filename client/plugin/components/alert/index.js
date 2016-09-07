import React from 'react';

import className from 'classnames';

import withClassPrefix from 'utils/class-prefix';

class Alert extends React.Component {
  renderCloseButton() {
    if(this.props.dismissible) {
      return (
        <button className={withClassPrefix('close')} onClick={this.props.onClose}>
          ×
        </button>
      )
    } else {
      return null;
    }
  }

  render() {
    const classes = withClassPrefix(className(`alert alert-${this.props.type}`, { 'alert-dismissible': this.props.dismissible }));

    return (
      <div className={classes}>
        {this.props.children}
        {this.renderCloseButton()}
      </div>
    );
  }
}

export default Alert;
