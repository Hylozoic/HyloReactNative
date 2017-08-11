import { rhino, rhino50, alabaster } from '../../../style/colors'

const screenMargin = 16

const option = {
  color: rhino50,
  fontSize: 15,
  paddingVertical: 10,
  paddingHorizontal: 15
}

export default {
  container: {
    marginHorizontal: screenMargin
  },
  feedTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  option,
  chosenOption: {
    ...option,
    color: rhino,
    backgroundColor: alabaster,
    fontFamily: 'Circular-Bold'
  }
}
