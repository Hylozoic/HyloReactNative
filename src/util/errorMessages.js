export function testJSON (text) {
  if (typeof text !== 'string') {
    return false
  } try {
    JSON.parse(text)
    return true
  } catch (e) {
    return false
  }
}
export default function errorMessages (type, action = '') {
  let err

  if (testJSON(type)) {
    err = JSON.parse(type)
    err = err.error
  } else {
    err = type
  }

  const errors = {
    'no user': `${action} was canceled or no user data was found.`,
    'no email': 'Please enter a valid email address',
    'no email provided': 'Please enter a valid email address',
    'invalid-email': 'Please enter a valid email address',
    'duplicate-email': 'Account already exists',
    'no password provided': 'Please enter your password',
    'email not found': 'Email address not found',
    'invalid-code': 'Invalid code, please try again',
    'invalid-link': 'Link expired, please try again',
    'invite-expired': 'Sorry, your invitation to this group has already been used, is invalid, or expired. Contact your moderator for another one.',
    default: err
  }

  return errors[err] || errors.default
}
