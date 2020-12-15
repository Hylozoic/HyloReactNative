import {
  capeCod,
  rhino60,
  caribbeanGreen
} from 'style/colors'

export default {
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  header: {
    marginTop: 25
  },
  headerText: {
    color: capeCod,
    fontSize: 24,
    fontFamily: 'Circular-Bold',
    textAlign: 'center',
    marginBottom: 25
  },
  bodyText: {
    color: rhino60,
    fontSize: 16,
    fontFamily: 'Circular-Bold',
    textAlign: 'center'
  },
  image: {
    flex: 1
  },
  goBackButton: {
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    height: 36,
    width: 200,
    borderRadius: 50,
    justifyContent: 'center'
  },
  goBackButtonText: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 32
  },
  paddedRow: {
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 15
  }
}
