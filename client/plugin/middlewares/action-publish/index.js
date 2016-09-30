import { publish } from 'utils/pubsub';

const actionPublish = store => next => action => {
  if(action.type) {
    publish(action.type, action);
  }

  return next(action);
}

export default actionPublish;
