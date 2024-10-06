import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { modalScreenName } from 'hooks/useIsModalScreen'
import { firstName } from 'store/models/Person'
import Avatar from 'components/Avatar'
import PeopleListModal from 'components/PeopleListModal'
import { rhino10 } from 'style/colors'
import { useTranslation } from 'react-i18next'

export default function ThreadHeaderTitle ({ thread, currentUserId, navigation }) {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const toggleModalIsVisible = () => setModalIsVisible(!modalIsVisible)

  if (!thread) return null

  const otherParticipants = thread.participants.filter(p => p.id !== currentUserId).toRefArray()
  const avatarUrls = otherParticipants.map(p => p.avatarUrl)
  const names = otherParticipants.length > 1 ? otherParticipants.map(firstName) : [otherParticipants[0]?.name || 'Deleted User']
  const goToParticipant = ({ id }) => navigation.navigate(modalScreenName('Member'), { id })
  const handleOnPress = () => {
    otherParticipants.length > 1
      ? toggleModalIsVisible()
      : otherParticipants[0] && goToParticipant(otherParticipants[0])
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleOnPress}>
          <View style={styles.title}>
            {avatarUrls.slice(0, 3).map((avatarUrl, index) => {
              return (
                <Avatar
                  key={index}
                  avatarUrl={avatarUrl}
                  size='small'
                  hasBorder={false}
                  hasOverlap={avatarUrls.length > 1}
                  zIndex={3 - index}
                />
              )
            })}
            <Text style={styles.participantNames}>{participantNamesSummary(names)}</Text>
          </View>
        </TouchableOpacity>
        <PeopleListModal
          people={otherParticipants}
          onPressPerson={goToParticipant}
          isVisible={modalIsVisible}
          toggleModal={toggleModalIsVisible}
        />
      </View>
    </>
  )
}

export function participantNamesSummary (names) {
  const { t } = useTranslation()
  if (names.length < 3) return names.join(' & ')
  return `${names[0]} & ${names.length - 1} ${t('others')}`
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  participantNames: {
    paddingLeft: 10,
    color: rhino10,
    fontSize: 18,
    fontFamily: 'Circular-Bold'
  }
}