import React from 'react';

import DashboardWindow from 'components/dashboard/dashboard-window';
import DashboardOpener from 'components/dashboard/dashboard-opener';

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <DashboardWindow/>
        <DashboardOpener/>
      </div>
    );
  }
}

export default Dashboard;
