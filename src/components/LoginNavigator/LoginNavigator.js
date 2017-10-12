import { StackNavigator } from 'react-navigation'
import Login from '../Login'
import CheckInvitation from '../CheckInvitation'
import InviteExpired from '../InviteExpired'
import Signup from '../Signup'
import SignupFlow1 from '../SignupFlow/SignupFlow1'
import SignupFlow2 from '../SignupFlow/SignupFlow2'
import SignupFlow3 from '../SignupFlow/SignupFlow3'
import SignupFlow4 from '../SignupFlow/SignupFlow4'
import SignupFlow5 from '../SignupFlow/SignupFlow5'

export default StackNavigator({
  Login: {
    screen: Login,
    path: 'login'
  },
  CheckInvitation: {
    screen: CheckInvitation,
    path: 'h/use-invitation'
  },
  CheckInvitationAccessCode: {
    screen: CheckInvitation,
    path: 'c/:slug/join/:accessCode'
  },
  InviteExpired: {
    screen: InviteExpired,
    path: 'invite-expired'
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
  },
  SignupFlow3: {
    screen: SignupFlow3,
    path: 'signup/3'
  },
  SignupFlow4: {
    screen: SignupFlow4,
    path: 'signup/4'
  },
  SignupFlow5: {
    screen: SignupFlow5,
    path: 'signup/5'
  }
})
