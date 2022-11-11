import { POST_TYPES } from 'store/models/Post'
import { capeCod10, rhino60, rhino30, caribbeanGreen, white } from 'style/colors'

export default {
  container: {
    backgroundColor: white,
    borderColor: capeCod10,
    borderRadius: 4,
    borderWidth: 1
  },
  detailsContainer: {
    marginBottom: 16
  },
  images: {
    marginTop: -8,
    marginBottom: 12
  },
  files: {
    marginBottom: 12
  },
  infoRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: capeCod10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoRowLabel: {
    fontSize: 13,
    color: rhino30,
    fontFamily: 'Circular-Book',
    marginRight: 5
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(225, 229, 233, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  locationIcon: {
    marginRight: 5,
    color: rhino60
  },
  locationText: {
    fontSize: 12,
    color: rhino60
  },
  infoRowInfo: {
    fontSize: 13,
    color: rhino60,
    fontFamily: 'Circular-Book'
  },
  projectJoinButton: {
    backgroundColor: POST_TYPES.project.backgroundColor,
    color: POST_TYPES.project.primaryColor,
    marginHorizontal: 12,
    marginBottom: 10
  },
  projectMembersContainer: {
    borderTopWidth: 1,
    borderColor: capeCod10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  memberCount: {
    color: caribbeanGreen
  },
  topics: {
    paddingHorizontal: 7,
    paddingBottom: 10
  },
  topicsOnImage: {
    marginTop: 8
  },
  groups: {
    backgroundColor: 'rgba(225, 229, 233, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 12
  }
}
