import { combineReducers } from 'redux';
import user from './user';
import service from './service';
import myServices from './my-services';

export default combineReducers({
  user,
  service,
  myServices
});