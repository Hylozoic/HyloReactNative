import {
  caribbeanGreen,
  white60onCaribbeanGreen,
  white40onCaribbeanGreen,
  amaranth
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
  },
  errorWrapper: {
    alignItems: 'center',
    marginBottom: 10
  },
  error: {
    paddingHorizontal: 10,
    paddingVertical: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 100,
  },
  errorText: {
    color: amaranth,
    fontSize: 12
  }
}
