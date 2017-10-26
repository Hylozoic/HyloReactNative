import { StackNavigator } from 'react-navigation'
import Login from '../Login'
import CheckInvitation from '../CheckInvitation'
import InviteExpired from '../InviteExpired'
import Signup from '../Signup'
import SignupFlow1 from '../SignupFlow/SignupFlow1'

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
  }
})
