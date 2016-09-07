import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'


import user from './user';
import tokens from './tokens';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  user,
  tokens
});
