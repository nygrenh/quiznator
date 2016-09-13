import React from 'react';

import Navigation from 'components/navigation';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="main-wrapper">
        <Navigation/>

        <div className="container m-t-1">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Dashboard;
