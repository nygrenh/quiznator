import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

const userResourceLoader = ({ dispatcher }) => Component => {
  class UserResourceLoaderComponent extends React.Component {
    componentDidMount() {
      this.load();
    }

    load() {
      if(this.props.user && this.props.user.id) {
        this.props.load();
      }
    }

    componentDidUpdate(nextProps) {
      if(this.props.user && nextProps.user && nextProps.user.id !== this.props.user.id) {
        this.load();
      }
    }

    render() {
      return <Component {...omit(this.props, ['load'])}/>
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => ({
    load: () => dispatcher(dispatch, ownProps)
  });

  return connect(
    undefined,
    mapDispatchToProps
  )(UserResourceLoaderComponent);
}

export default userResourceLoader;
