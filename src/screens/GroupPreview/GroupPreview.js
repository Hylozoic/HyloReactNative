import React from 'react'
import { useSelector } from 'react-redux'
import { Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import Icon from 'components/Icon'
import { white } from 'style/colors'
import getGroup from 'store/selectors/getGroup'
import { accessibilityDescription, GROUP_VISIBILITY, GROUP_ACCESSIBILITY } from 'store/models/Group'
import Button from 'components/Button'
import LinearGradient from 'react-native-linear-gradient'
import { bannerlinearGradientColors } from 'style/colors'

export default function GroupPreview ({ route, navigation }) {
  const groupId = route.params.groupId
  const group = useSelector(state => getGroup(state, { id: groupId }))

  // TODO: Handle GROUP_VISIBILITY
  const canJoin = [GROUP_ACCESSIBILITY.Open, GROUP_ACCESSIBILITY.Restricted].includes(group.accessibility)

  const groupBannerImage = group.bannerUrl
  ? { uri: group.bannerUrl }
  : null

  // TODO: See evo GroupDetail.js#64 for join workflow...
  return (
    <View style={styles.container}>
      <ImageBackground source={groupBannerImage} style={styles.headerBackgroundImage}>
        <LinearGradient style={styles.headerBannerGradient} colors={bannerlinearGradientColors} />
        <View style={styles.headerContent}>
          <Image source={{ uri: group.avatarUrl }} style={styles.headerAvatar} />
          <Text style={styles.headerText}>{group.name}</Text>
        </View>  
      </ImageBackground>
      <View style={styles.mainContent}>
        <Text style={styles.groupDescription}>{group.description}</Text>
        {!canJoin && (
          <Text>{accessibilityDescription(group.accessibility)}</Text>
        )}
        {canJoin && <Button onPress={() => {}} text='Join' />}
      </View>
    </View>
  )
}

export function NavItem ({ label, iconName, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} key={label}>
      <Icon style={styles.navItemIcon} name={iconName} />
      <Text style={styles.navItemLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

export const styles = {
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
    paddingBottom: 20
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
    marginBottom: 15
  }
}
