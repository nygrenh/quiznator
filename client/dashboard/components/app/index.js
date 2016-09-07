import React from 'react';

import Navigation from 'components/navigation';
import Routes from 'routes';

class App extends React.Component {
  render() {
    return (
      <div className="main-wrapper">
        <Navigation/>

        <div className="container">
          <Routes history={this.props.history}/>
        </div>
      </div>
    );
  }
}

export default App;
