import React from 'react'
import { View, FlatList, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import Header from '../Header'
import Avatar from '../../Avatar'
import PopupMenuButton from '../../PopupMenuButton'
import Icon from '../../Icon'
import { DEFAULT_BANNER } from '../../../store/models/Community'
import styles from './Members.styles'
import { some, values, keys, isUndefined } from 'lodash/fp'

const title = 'Members'

export default class Members extends React.Component {
  static navigationOptions = ({navigation}) => (Header(navigation, title))

  componentDidMount () {
    this.props.fetchMembers()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    if (some(key => this.props[key] !== prevProps[key], [
        'slug',
        'networkSlug',
        'sortBy',
        'search',
      ])) {
      this.props.fetchMembers()
    }
  }

  render () {
    const { community, subject, sortBy, setSort } = this.props

    const sortKeys = sortKeysFactory(subject)

    console.log('Values', sortKeys.values)
    const onSelect = (action, index) => {
      if (!isUndefined(index)) {
        console.log('sortKeys', sortKeys, keys(sortKeys)[index])
        setSort(keys(sortKeys)[index])
      }
    }

    let { members } = this.props

    // Members need to be even since it's rows of 2
    if (members.length % 2 > 0) {
      members.push({id: -1})
    }

    const headerComponent = <View>
      <Banner community={community} all={!community} />
      <View style={styles.listControls}>
        <TextInput placeholder='Search Members' style={styles.listControl} />

        <PopupMenuButton actions={values(sortKeys)} onSelect={onSelect}>
          <View style={styles.listControl}>
            <Text>{sortKeys[sortBy]}</Text>
            <Icon name='ArrowDown' style={[styles.optionText, styles.downArrow]} />
          </View>
        </PopupMenuButton>
      </View>
    </View>

    return <View style={styles.container}>
      <FlatList
        data={members}
        numColumns='2'
        renderItem={({item}) => {
          if (item.name) {
            return <Member member={item} showMember={this.props.showMember}/>
          } else {
            return <View style={styles.cell} />
          }
        }}
        keyExtractor={(item, index) => item.id}
        ListHeaderComponent={headerComponent}
      />
    </View>
  }
}

function Member ({ member, showMember }) {
  return <TouchableOpacity onPress={() => showMember(member.id)}
                           style={[styles.cell, styles.memberCell]} >
    <View style={styles.avatarSpacing}>
      <Avatar avatarUrl={member.avatarUrl} />
    </View>
    <Text>{member.name}</Text>
    <Text>{member.bio}</Text>
  </TouchableOpacity>
}

function Banner ({ community, all }) {
  let bannerUrl, name

  if (all) {
    name = 'All Communities'
    bannerUrl = DEFAULT_BANNER
  } else if (!community) {
    return null
  } else {
    ({ bannerUrl, name } = community)
  }

  return <View style={styles.bannerContainer}>
    <Image source={{uri: bannerUrl}} style={styles.image} />
    <View style={styles.titleRow}>
      <Text style={styles.name}>{name}</Text>
    </View>
  </View>
}

// these keys must match the values that hylo-node can handle
function sortKeysFactory (subject) {
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  if (subject !== 'network') sortKeys['join'] = 'Newest'
  return sortKeys
}
