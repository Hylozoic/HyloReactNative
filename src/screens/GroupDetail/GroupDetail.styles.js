import HeaderRightButton from 'navigation/header/HeaderRightButton'
import { rhino10, rhino20, rhino80, white } from 'style/colors'

const styles = {
  container: {
    backgroundColor: white,
    flex: 1
  },
  
  // Header
  headerBackgroundImage: {},
  headerBannerGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    paddingBottom: 10
  },
  headerAvatar: {
    height: 42,
    width: 42,
    borderRadius: 4,
    marginBottom: 6
  },
  headerText: {
    fontFamily: 'Circular-Bold',
    marginBottom: 10,
    color: white,
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7
  },

  // Main content
  mainContent: {
    padding: 15
  },
  groupDescription: {
    marginBottom: 10
  },
  alreadyRequestedText: {
    padding: 15,
    color: white,
    backgroundColor: rhino80
  },
  joinQuestions: {
    marginBottom: 10
  },
  joinQuestion: {
    marginBottom: 10
  },
  joinQuestionText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  joinQuestionAnswerInput: {
    fontSize: 12,
    marginTop: 10,
    backgroundColor: rhino20,
    padding: 10
  },
  joinButton: {}
}

export default styles