const imageHeight = 96
export default {
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1
  },
  image: {
    height: imageHeight,
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    height: imageHeight,
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.3
  },
  title: {
    position: 'relative',
    top: -44,
    fontFamily: 'Circular-Bold',
    fontSize: 24,
    color: 'white',
    backgroundColor: 'transparent',
    zIndex: 10,
    marginLeft: 16
  }
}
