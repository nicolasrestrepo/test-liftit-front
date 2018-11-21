import React from 'react';

import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { compose } from 'redux'; 
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames/bind';
import { toast } from "react-toastify";
import { withFormik } from 'formik';
import { addUser } from '../../../redux/actions/user'; 

import { login } from './service';
import styles from './style.scss';

const cx = classNames.bind(styles);

function SignIn(props) {
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = props;

  return (

    <React.Fragment>
      <div className={cx('container')}>
        <div className={cx('w-50', 'heading-login')}>
          <h1 className={cx('title')}>Liftit Test</h1>
        </div>
        <div className={cx('w-50', 'login')}>
          <h2 className={cx('login__title')}>Login</h2>
          <form className={cx('form')} onSubmit={handleSubmit}>
            <TextField
              id="email"
              label="Email"
              value={values.userName}
              onChange={handleChange}
              className={cx('input')}
              margin="normal"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={values.password}
              className={cx('input')}
              onChange={handleChange}
              margin="normal"
            />
            <Button variant="contained" type="submit" color="primary" disabled={isSubmitting} className={cx('button-login')}>
              <p className={cx('button__label')}>Log In</p>
              {isSubmitting && <CircularProgress size={20} />}
            </Button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => ({
  addUser: user => dispatch(addUser(user))
})
export default compose(
  connect(null, mapDispatchToProps),
  withFormik({
    handleSubmit: async (values, { props, setSubmitting }) => {
  
      const response = await login(values.email, values.password);
  
      setSubmitting(false);
  
      if (response.data) {
        await localStorage.setItem('token', response.data.token);
        props.addUser(response.data.user);
        props.history.push('/');
      } else {
        toast.error("Invalid user or password", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  })
)(SignIn);