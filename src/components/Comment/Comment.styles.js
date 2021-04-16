import { limedSpruce, slateGrey80, nevada, rhino50, caribbeanGreen } from 'style/colors'

export default {
  container: {
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20
  },
  details: {
    flex: 1
  },
  avatar: {
    marginRight: 10
  },
  meta: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8
  },
  headerRight: {
    paddingTop: 3,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  menuIcon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 5,
    color: rhino50
  },
  name: {
    color: limedSpruce,
    fontFamily: 'Circular-Bold',
    fontSize: 14
  },
  replyLink: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: slateGrey80,
    padding: 3,
    borderRadius: 5
  },
  replyLinkText: {
    fontSize: 12,
    color: slateGrey80,
    marginLeft: 5
  },
  replyLinkIcon: {
    transform: [{rotateY: '180deg'}],
    fontSize: 12,
    color: slateGrey80
  },
  date: {
    color: slateGrey80,
    fontFamily: 'Circular-Book',
    fontSize: 12
  },
  text: {
    color: nevada,
    fontFamily: 'Circular-Book',
    fontSize: 14,
    // not sure why this works. Setting height to 0 here should collapse all
    // comment text, but instead it just gets rid of extra spacing in comments.
    // Tested and it seems fine, but if comment layout looks word somewhere, try
    // removing this line.
    height: 0
  },
  richTextStyles: {
    a: {
      color: caribbeanGreen
    },
    p: {
      marginTop: 3,
      marginBottom: 3
    }
  }
}
