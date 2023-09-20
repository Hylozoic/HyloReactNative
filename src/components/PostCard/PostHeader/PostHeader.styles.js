import { POST_TYPES } from 'store/models/Post'
import { rhino30, rhino50, caribbeanGreen, rhino40, white80onCaribbeanGreen, white40onCaribbeanGreen } from 'style/colors'

export const styles = {
  badgeRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1,
    marginRight: 2
  },
  container: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomColor: 'rgba(235, 235, 235, 1.0)',
    borderBottomWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 9,
    alignItems: 'center'
  },
  nameAndDate: {
    paddingRight: 7,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    fontSize: 13,
    color: '#363D3C',
    fontFamily: 'Circular-Bold',
    marginRight: 4
  },
  date: {
    marginLeft: 2,
    fontSize: 12,
    color: rhino40,
    fontFamily: 'Circular-Book'
  },
  avatarSpacing: {
    paddingRight: 7
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
  allBadgesPill:{
    backgroundColor: white40onCaribbeanGreen,
    borderRadius: 30,
    border: 1,
    padding: 2,
    flex: 1,
    flexDirection: 'row',
    borderColor: white40onCaribbeanGreen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -34
  },
  badgePill: {
    backgroundColor: white80onCaribbeanGreen,
    borderRadius: 30,
    border: 1,
    padding: 2,
    gap: -3,
    flex: 1,
    flexDirection: 'row',
    borderColor: white80onCaribbeanGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topicLabel: {
    fontSize: 12,
    paddingRight: 5,
    flex: 1,
    fontFamily: 'Circular-Book',
    color: caribbeanGreen
  },
  upperRight: {
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
