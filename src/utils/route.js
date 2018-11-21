import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import isAuthenticated from './session';
import Main  from '../modules/common/Main';


class PrivateRoute extends React.Component {
  state = {
    isAuth: true
  };

  componentDidMount() {
	this._isAuth();
  }
    
  _isAuth = async () => {
    const res = await isAuthenticated();
    await this.setState({ isAuth: res });
  };

  render() {
    const { component: Component, ...rest } = this.props;
    const { isAuth = true } = this.state;
    return ( 
      
      <Route
      {...rest}
      render={props =>
        (isAuth ? (
          <div className="DefaultLayout">
            <Main component={Component} {...props} />
          </div>
        ) : (
          <Redirect
            to={{
              pathname: '/sign-in',
            }}
          />
        ))}
    />
    );
  }
}

export default PrivateRoute;