import {
  StackNavigator
} from 'react-navigation'
import Login from '../Login'
import Signup from '../Signup'
import SignupFlow1 from '../SignupFlow/SignupFlow1'
import SignupFlow2 from '../SignupFlow/SignupFlow2'

export default StackNavigator({
  Login: {
    screen: Login,
    path: 'login'
  },
  Signup: {
    screen: Signup,
    path: 'signup'
  },
  SignupFlow1: {
    screen: SignupFlow1,
    path: 'signup/1'
  },
  SignupFlow2: {
    screen: SignupFlow2,
    path: 'signup/2'
  }
})
