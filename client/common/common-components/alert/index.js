import React from 'react';
import className from 'classnames';

class Alert extends React.Component {
  renderCloseButton() {
    if(this.props.dismissible) {
      return (
        <button className="close" onClick={this.props.onClose}>
          ×
        </button>
      )
    } else {
      return null;
    }
  }

  render() {
    const classes = className(`alert alert-${this.props.type}`, { 'alert-dismissible': this.props.dismissible });

    return (
      <div className={`${classes} ${this.props.className || ''}`}>
        {this.props.children}
        {this.renderCloseButton()}
      </div>
    );
  }
}

export default Alert;
