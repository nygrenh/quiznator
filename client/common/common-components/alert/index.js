import React from 'react';
import className from 'classnames';

const Alert = props => {
  const classes = className('alert', props.type ? `alert-${props.type}` : null);

  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}

export default Alert;
