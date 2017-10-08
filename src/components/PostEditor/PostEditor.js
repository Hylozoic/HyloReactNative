import React from 'react'
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './PostEditor.styles'
import Loading from '../Loading'
import { get } from 'lodash/fp'
import striptags from 'striptags'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { decode } from 'ent'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save } = get('state.params', navigation) || {}
    return {
      headerTitle,
      headerRight: save ? <Button title='Save' onPress={save} /> : null
    }
  }

  constructor (props) {
    super(props)
    const { post, communityId } = props
    this.state = {
      title: get('title', post) || '',
      type: 'discussion',
      communityIds: post ? post.communities.map(x => x.id) : [communityId]
    }
  }

  componentDidMount () {
    const { post, navigation, setDetails } = this.props
    setDetails(get('details', post))

    navigation.setParams({
      headerTitle: post ? 'Edit Post' : 'New Post',
      save: () => {
        const { title, type, communityIds } = this.state
        const postData = {
          title,
          type,
          details: this.props.details,
          communities: communityIds.map(id => ({id}))
        }
        return this.props.save(postData)
      }
    })
  }

  render () {
    const { details, editDetails, postId } = this.props
    const { title, type } = this.state

    if (postId && !details) return <Loading />

    return <KeyboardAvoidingView style={styles.container} {...kavProps}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          <SectionLabel>What are you posting today?</SectionLabel>
          <View style={[styles.typeButtonRow, styles.section]}>
            {['discussion', 'request', 'offer'].map(t =>
              <TypeButton type={t} key={t} selected={t === type}
                onPress={() => this.setState({type: t})} />)}
          </View>

          <SectionLabel>Title</SectionLabel>
          <View style={[styles.textInputWrapper, styles.section]}>
            <TextInput value={title} style={styles.textInput}
              onChangeText={title => this.setState({title})}
              placeholder={titlePlaceholders[type]}
              underlineColorAndroid='transparent' />
          </View>

          <SectionLabel>Details</SectionLabel>
          <TouchableOpacity style={[styles.textInputWrapper, styles.section]}
            onPress={editDetails}>
            <Details details={details} placeholder={detailsPlaceholder} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?'
}

const detailsPlaceholder = 'What else should we know?'

function SectionLabel ({ children }) {
  return <Text style={styles.sectionLabel}>
    {children}
  </Text>
}

export function Details ({details, placeholder}) {
  const style = details ? styles.textInput : styles.textInputPlaceholder
  const body = excerptDetails(details) || placeholder
  return <Text style={style}>{body}</Text>
}

function TypeButton ({ type, selected, onPress }) {
  const s = styles.typeButton
  return <TouchableOpacity onPress={onPress}
    style={[s.box, selected && s[type].box]}>
    <Text style={[s.text, selected && s[type].text]}>
      {type.toUpperCase()}
    </Text>
  </TouchableOpacity>
}

function excerptDetails (details) {
  return decode(striptags(details, [], ' '))
  .replace(/\s+/g, ' ')
  .substring(0, 100)
}
