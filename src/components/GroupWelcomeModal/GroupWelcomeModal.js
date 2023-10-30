import React from 'react'
import { isEmpty } from 'lodash'
import FastImage from 'react-native-fast-image'
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import { TopDownModal } from 'components/PeopleListModal/PeopleListModal'
import { useDispatch, useSelector } from 'react-redux'
import updateMembershipSettings from 'store/actions/updateMembershipSettings'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getGroup from 'store/selectors/getGroup'
import { caribbeanGreen } from 'style/colors'

export default function GroupWelcomeModal ({ isVisible, groupId }) {
  const dispatch = useDispatch()
  const currentMemberships = useSelector(state => getMyMemberships(state))
  const currentGroup = useSelector(state => getGroup(state, { id: groupId }))
  const membership = currentMemberships.find(m => m.group.id === groupId)
  const showJoinForm = membership?.settings?.showJoinForm

  const { name, avatarUrl, purpose, bannerUrl } = currentGroup
  const imageSource = { uri: avatarUrl || DEFAULT_AVATAR }
  const bgImageSource = { uri: bannerUrl || DEFAULT_BANNER }

  const handleClose = async () => {
    await dispatch(updateMembershipSettings(currentGroup.id, { showJoinForm: false }))
    return null
  }

  const getContainerHeight = () => { // This will need to be shifted for agreements
    if (isEmpty(purpose)) {
      return '45%'
    } else {
      return '60%'
    }
  }

  return (
    <TopDownModal
      isVisible={purpose && showJoinForm} // If there is no purpose... its not even really worth showing this panel. At least until we add more content
      propagateSwipe={2 > 5}
      toggleModal={handleClose}
      containerStyle={{
        height: getContainerHeight(),
        padding: 15
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: 22,
          marginBottom: 22,
          gap: 4
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <ImageBackground source={bgImageSource} style={[styles.bannerBackground, styles.columnStyling]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <View style={styles.avatarContainer}>
                <FastImage source={imageSource} style={styles.groupAvatar} />
              </View>
              <Text style={styles.heading}>Welcome to:</Text>
            </View>
            <Text style={[styles.heading]}>{name}</Text>
          </ImageBackground>
        </View>
        {!isEmpty(purpose) &&
          <View>
            <Text style={styles.purposeText}>Our Purpose:</Text>
            <Text style={styles.purposeText}>{purpose}</Text>
          </View>}
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleClose}>
          <View style={styles.callToAction}>
            <View style={styles.loginButton}>
              <Text style={styles.callToActionText}>Jump in!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </TopDownModal>
  )
}

const styles = {
  groupAvatar: {
    height: 20,
    width: 20
  },
  avatarContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 24,
    width: 24
  },
  columnStyling: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },
  bannerBackground: {
    width: '100%',
    paddingTop: 6,
    paddingBottom: 6
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 500
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: caribbeanGreen,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 5
  },
  callToAction: {
    height: 44
  },
  callToActionText: {
    flexGrow: 1,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 18,
    lineHeight: 34,
    paddingLeft: 10,
    paddingRight: 10
  },
  purposeText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: 'Circular-Book',
    fontSize: 16,
    lineHeight: 24
  }
}
