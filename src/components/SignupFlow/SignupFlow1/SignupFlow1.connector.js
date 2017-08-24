import { connect } from 'react-redux'

export function mapStateToProps (state, props) {
  return {
    name: 'Sonia Smith',
    email: 'sonia@gmail.com',
    password: 'password',
    changeSetting: setting => value => console.log('set', setting, 'to', value)
  }
}

export default connect(mapStateToProps)
