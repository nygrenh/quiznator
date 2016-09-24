import { setUser } from 'state/user';

const nop = () => () => {};

function syncQuiznatorWithStore(store) {
  const self = {};

  self.setUser = user => {
    if(!user || !user.accessToken || !user.id) {
      throw new Error('access token and id is required for user!');
    } else {
      store.dispatch(setUser(user));
    }
  }

  return self;
}

export default syncQuiznatorWithStore;
