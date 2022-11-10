import { POST_TYPES } from 'store/models/Post'
import { rhino30, rhino50, caribbeanGreen } from 'style/colors'

export const styles = {
  container: {
    flexDirection: 'row',
    paddingBottom: 6,
    marginBottom: 10,
    borderBottomColor: 'rgba(235, 235, 235, 1.0)',
    borderBottomWidth: 1
  },
  meta: {
    paddingTop: 7 + 9,
    paddingRight: 7,
    flex: 1,
    justifyContent: 'space-around'
  },
  avatarSpacing: {
    paddingTop: 7 + 9,
    paddingLeft: 7 + 5,
    paddingRight: 7
  },
  avatarNudge: {
    paddingTop: 18
  },
  username: {
    fontSize: 14,
    color: '#363D3C',
    fontFamily: 'Circular-Bold'
  },
  usernameNudge: {
    top: 10
  },
  dateRow: {
    flexDirection: 'row',
    flex: 1
  },
  metaText: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book'
  },
  spacer: {
    fontSize: 12,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginHorizontal: 5
  },
  contextLabel: {
    fontSize: 12,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen
  },
  topicList: {
    marginLeft: 4,
    flex: 1
  },
  topicLabel: {
    fontSize: 12,
    paddingRight: 5,
    flex: 1,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen
  },
  upperRight: {
    position: 'absolute',
    paddingTop: 14,
    paddingRight: 6,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  pinIcon: {
    fontSize: 20,
    color: rhino50,
    marginRight: 10
  },
  moreIcon: {
    fontSize: 20,
    paddingLeft: 5,
    paddingRight: 5,
    color: rhino50
  },
  announcementIcon: {
    color: caribbeanGreen,
    fontSize: 20,
    alignItems: 'flex-end',
    marginRight: 2
  }
}

export const labelStyles = {
  box: {
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: 0,
    marginTop: 1
  },
  text: {
    fontSize: 10,
    fontFamily: 'Circular-Bold',
    letterSpacing: 0.8
  },
  discussion: {
    box: {
      backgroundColor: POST_TYPES.discussion.backgroundColor
    },
    text: {
      color: POST_TYPES.discussion.primaryColor
    }
  },
  event: {
    box: {
      backgroundColor: POST_TYPES.event.backgroundColor
    },
    text: {
      color: POST_TYPES.event.primaryColor
    }
  },
  offer: {
    box: {
      backgroundColor: POST_TYPES.offer.backgroundColor
    },
    text: {
      color: POST_TYPES.offer.primaryColor
    }
  },
  resource: {
    box: {
      backgroundColor: POST_TYPES.resource.backgroundColor
    },
    text: {
      color: POST_TYPES.resource.primaryColor
    }
  },
  project: {
    box: {
      backgroundColor: POST_TYPES.project.backgroundColor
    },
    text: {
      color: POST_TYPES.project.primaryColor
    }
  },
  request: {
    box: {
      backgroundColor: POST_TYPES.request.backgroundColor
    },
    text: {
      color: POST_TYPES.request.primaryColor
    }
  }
}

export default styles
