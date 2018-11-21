import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { removeUser } from '../../../redux/actions/user';

import styles from './style.scss';

const cx = classNames.bind(styles);

class Main extends React.Component {
    state = {
        anchorEl: null,
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
      };


      logOut = async () => {
        const { history: { push }, removeUserAction } = this.props;
        await localStorage.removeItem('token');
        removeUserAction();
        push('/sign-in')
      }
    
    render(){
        const { classes, user, component: Component, ...rest } = this.props;
        const { anchorEl } = this.state;

        const open = Boolean(anchorEl);
        return(
            <React.Fragment>
        <AppBar
            position="absolute"
          >
            <Toolbar className={cx('toolbar')}>
              <Typography
                component="h1"
                variant="title"
                color="inherit"
                noWrap
              >
                Liftit Test
              </Typography>
              <div>
                <Button
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  
                  <AccountCircle />
                  <span>{user.firstName} {user.lastName}</span>
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.logOut}>Sign Out</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
               <Component 
                className={cx('content')}
               {...rest} />
            </React.Fragment>
        )
    }

}

const mapStateToProp = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    removeUserAction: () => dispatch(removeUser())
})
  
  
export default connect(mapStateToProp, mapDispatchToProps)(Main);

