import { fuchsiaPink, pictonBlue, caribbeanGreen } from 'style/colors'

const finalDimension = 32
const width = 22
const height = 21
const circleSize = 9

export default {
  allFeedsIcon: {
    position: 'relative',
    width,
    height,
    marginVertical: ((finalDimension - height) / 2),
    marginHorizontal: ((finalDimension - width) / 2),
    alignItems: 'center'
  },
  circleIcon: {
    position: 'absolute',
    fontSize: circleSize
  },
  purple: {
    top: 0,
    left: ((width - circleSize) / 2),
    color: fuchsiaPink
  },
  blue: {
    bottom: 0,
    left: 0,
    color: pictonBlue
  },
  green: {
    bottom: 0,
    right: 0,
    color: caribbeanGreen
  }
}
