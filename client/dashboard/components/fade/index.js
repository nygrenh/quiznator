import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const fade = options => Component => class extends React.Component {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        transitionAppear={true}>
        <Component {...this.props} key={this.props.key || options.key}/>
      </ReactCSSTransitionGroup>
    )
  }
}

export default fade;
