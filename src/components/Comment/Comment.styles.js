import mixins from '../../style/mixins'
import { limedSpruce, slateGrey80, nevada } from '../../style/colors'

export default {
  container: {
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12
  },
  avatar: {
    marginRight: 10
  },
  name: {
    color: limedSpruce,
    fontFamily: 'Circular-Bold',
    fontSize: 14
  },
  date: {
    color: slateGrey80,
    fontFamily: 'Circular-Book',
    fontSize: 12,
    marginBottom: 8
  },
  text: {
    color: nevada,
    fontFamily: 'Circular-Book',
    fontSize: 14
  }
}
