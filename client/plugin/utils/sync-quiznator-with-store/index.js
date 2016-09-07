import { setUser } from 'state/user';

function syncQuiznatorWithStore(store) {
  const self = {};

  self.setUser = user => {
    if(!user || !user.id) {
      throw new Error('id is required for user');
    } else {
      store.dispatch(setUser(user));
    }
  }

  return self;
}

export default syncQuiznatorWithStore;
