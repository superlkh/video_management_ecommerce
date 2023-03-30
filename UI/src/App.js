import React, { Component } from 'react';
import { HashRouter, Route, Router, Switch, BrowserRouter } from 'react-router-dom';
import './scss/style.scss';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./components/login/Login'));
const Register = React.lazy(() => import('./components/register/Register'));
const EnterUserName = React.lazy(() => import('./components/forgotPassword/EnterUserName'));
const EnterOTP = React.lazy(() => import('./components/forgotPassword/EnterOTP'));
const EnterNewPassword = React.lazy(() => import('./components/forgotPassword/EnterNewPassword'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/enterUserName" name="Enter UserName Page" render={props => <EnterUserName {...props}/>} />
              <Route exact path="/enterOTP/:userName" name="Forgot Password Page" render={props => <EnterOTP {...props}/>} />
              <Route exact path="/enterNewPassword/:userName" name="Enter New Password Page" render={props => <EnterNewPassword {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
              <Route path="/worker.js"/>
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
