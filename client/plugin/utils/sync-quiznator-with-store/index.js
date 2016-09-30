import { setUser, removeUser } from 'state/user';

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

  self.removeUser = () => {
    store.dispatch(removeUser());
  }

  return self;
}

export default syncQuiznatorWithStore;
