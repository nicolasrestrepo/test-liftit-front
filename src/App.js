import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react'
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './utils/route';
// modules
import SignIn from './modules/auth/sign-in';
import Service from './modules/dashboard/service';
// redux
import {store, persistor} from './redux/store';


const styleNode = document.createComment("insertion-point-jss");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = "insertion-point-jss";


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} >
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <React.Fragment>
          <BrowserRouter>
            <Switch>
              <Route exact path="/sign-in" component={SignIn} />
              <PrivateRoute exact path="/" component={Service}/>
            </Switch>
          </BrowserRouter>
          <ToastContainer/>
        </React.Fragment>
      </JssProvider>
      </PersistGate>
    </Provider>
  );
}
