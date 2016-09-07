import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import signIn from './sign-in';

export default combineReducers({
  form: formReducer,
  signIn
});
