import { caribbeanGreen, white80onCaribbeanGreen, white60onCaribbeanGreen } from 'style/colors'

export default {
  // From Community create flow
  container: {
    backgroundColor: caribbeanGreen,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  header: {},
  content: {},
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40
  },

  // 

  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Circular-Bold',
    marginBottom: 8
  },
  subTitle: {
    color: white80onCaribbeanGreen,
    fontSize: 14,
    fontFamily: 'Circular-Book',
    marginBottom: 38
  },
  continueButton: {
    color: caribbeanGreen,
    backgroundColor: 'white',
    disabledBackgroundColor: white60onCaribbeanGreen,
    height: 38,
    width: 132,
    fontSize: 16,
    marginLeft: 'auto'
  },
  // 
  headerStyle: {
    backgroundColor: caribbeanGreen,
    shadowColor: 'transparent'
  },
  headerTitleStyle: {
    color: 'white',
    fontFamily: 'Circular-Bold',
    fontSize: 12
  },
  headerTintColor: white60onCaribbeanGreen
}
