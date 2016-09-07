import React from 'react';

import withClassPrefix from 'utils/class-prefix';

const Loader = () => {
  return (
    <div className={withClassPrefix('spinner')}>
      <div className={withClassPrefix('double-bounce1')}></div>
      <div className={withClassPrefix('double-bounce2')}></div>
    </div>
  )
}

export default Loader;
