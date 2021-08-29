import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
//privateRoute
import PrivateRoute from './components/routing/PrivateRoute'
//Screens
import ForgotpasswordScreen from './components/screens/ForgotpasswordScreen'
import LoginScreen from './components/screens/LoginScreen'
import PrivateScreen from './components/screens/PrivateScreen'
import RegisterScreen from './components/screens/RegisterScreen'
import ResetpasswordScreen from './components/screens/ResetpasswordScreen'

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute exact path='/' component={PrivateScreen} />
          <Route exact path='/login' component={LoginScreen} />
          <Route exact path='/register' component={RegisterScreen} />
          <Route exact path='/forgotpassword' component={ForgotpasswordScreen} />
          <Route exact path='/passwordreset/:resetToken' component={ResetpasswordScreen} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
