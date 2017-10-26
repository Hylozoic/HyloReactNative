import { limedSpruce, slateGrey80, nevada, rhino50 } from '../../style/colors'

export default {
  container: {
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20
  },
  details: {
    flex: 1
  },
  avatar: {
    marginRight: 10
  },
  meta: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8
  },
  headerRight: {
    paddingTop: 3,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  menuIcon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 5,
    color: rhino50
  },
  name: {
    color: limedSpruce,
    fontFamily: 'Circular-Bold',
    fontSize: 14
  },
  date: {
    color: slateGrey80,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },
  text: {
    color: nevada,
    fontFamily: 'Circular-Book',
    fontSize: 14
  }
}
