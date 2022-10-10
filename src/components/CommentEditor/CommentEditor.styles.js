import { white, rhino, rhino80, gunsmoke, azureRadiance, rhino10, pictonBlue, amaranth } from 'style/colors'

export default {
  keyboardAccessoryContainerStyle: {
    // backgroundColor: rhino10,
    backgroundColor: 'transparent',
    marginBottom: 0,
    borderWidth: 0
  },

  editor: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  htmlEditor: {
    backgroundColor: white,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CCC'
  },

  prompt: {
    borderTopWidth: 1,
    borderColor: rhino10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  promptText: {
    color: rhino80,
    lineHeight: 22
  },

  promptClearIcon: {
    marginRight: 5,
    fontSize: 22,
    lineHeight: 20,
    color: amaranth
  },

  submitButton: {
    fontSize: 24,
    lineHeight: 22,
    marginLeft: 8,
    color: gunsmoke
  },

  activeButton: {
    color: azureRadiance
  }
}
