import {
  caribbeanGreen,
  white60onCaribbeanGreen,
  white40onCaribbeanGreen
} from 'style/colors'

export default {
  control: {
    position: 'relative'
  },
  label: {
    fontFamily: 'Circular-Bold',
    fontSize: 14,
    color: white60onCaribbeanGreen
  },
  textInput: {
    fontFamily: 'Circular-Book',
    fontSize: 18,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: white40onCaribbeanGreen,
    paddingBottom: 6,
    marginBottom: 15
  },
  // TODO: is this supposed to be here?
  continueButton: {
    height: 38,
    width: 200,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  buttonText: {
    fontFamily: 'Circular-Medium',
    fontSize: 16,
    color: caribbeanGreen
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
    top: 20,
    right: 20,
    position: 'absolute'
  }
}
