import { capeCod, rhino, rhino50, ghost, white } from 'style/colors'

const hasTextShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 7
}

const bannerHeight = 132

export default {
  container: {
    backgroundColor: white,
    flex: 1
  },
  bannerContainer: {
    zIndex: 10,
    height: bannerHeight
  },
  image: {
    height: bannerHeight,
    width: '100%',
    position: 'absolute'
  },
  gradient: {
    height: bannerHeight,
    width: '100%',
    position: 'absolute'
  },
  titleRow: {
    top: 46,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16
  },
  name: {
    fontSize: 24,
    fontFamily: 'Circular-Black',
    color: white,
    backgroundColor: 'transparent',
    ...hasTextShadow
  },
  button: {
    width: 185,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
    marginTop: 12,
    fontSize: 14
  }
}
