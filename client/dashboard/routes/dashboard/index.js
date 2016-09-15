import React from 'react';

import Navigation from 'components/navigation';
import Toaster from 'components/toaster';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="main-wrapper">
        <Toaster/>
        <Navigation/>

        <div className="container p-t-1 p-b-1">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Dashboard;
