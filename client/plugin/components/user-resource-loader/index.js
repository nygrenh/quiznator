import React from 'react';
import { connect } from 'react-redux';
import omit from 'lodash.omit';

const userResourceLoader = ({ dispatcher }) => Component => {
  class UserResourceLoaderComponent extends React.Component {
    componentDidMount() {
      this.props.user && this.props.load();
    }

    componentWillReceiveProps(nextProps) {
      const hasNewUser = nextProps.user && (!this.props.user || nextProps.user.id !== this.props.user.id);

      if(hasNewUser) {
        this.props.load();
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
