import React from 'react';
import { connect } from 'react-redux';

import Alert from 'common-components/alert';

import { selectToasts } from 'selectors/toaster';
import { createToast, removeToast } from 'state/toaster';

class Toaster extends React.Component {
  renderToasts() {
    return this.props.toasts.map(toast => {
      return (
        <Alert type={toast.type} key={toast.id} dismissible={true} onClose={() => this.props.onRemove(toast.id)}>
          {toast.content}
        </Alert>
      )
    });
  }

  render() {
    return (
      <div className="toaster">
        {this.renderToasts()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  toasts: selectToasts(state)
});

const mapDispatchToProps = dispatch => ({
  onRemove: id => dispatch(removeToast(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toaster);
