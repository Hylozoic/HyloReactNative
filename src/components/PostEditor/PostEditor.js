import React from 'react'
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './PostEditor.styles'
import Loading from '../Loading'
import striptags from 'striptags'
import { get, uniq } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { decode } from 'ent'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import ImageSelector from './ImageSelector'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save, isSaving } = get('state.params', navigation) || {}
    const title = isSaving ? 'Saving...' : 'Save'
    return {
      headerTitle,
      headerRight: save ? <View style={styles.saveButton}><Button title={title} disabled={isSaving} onPress={save} /></View> : null
    }
  }

  constructor (props) {
    super(props)
    const { post, communityIds, imageUrls } = props
    this.state = {
      title: get('title', post) || '',
      type: 'discussion',
      communityIds,
      imageUrls
    }
  }

  save = () => {
    const { navigation, save, details } = this.props
    const { title, type, communityIds, imageUrls } = this.state
    const postData = {
      title,
      type,
      details: details,
      communities: communityIds.map(id => ({id})),
      imageUrls
    }

    this.setState({isSaving: true})
    navigation.setParams({isSaving: true})

    return save(postData)
    .catch(e => {
      this.setState({isSaving: false})
      navigation.setParams({isSaving: false})
    })
  }

  componentDidMount () {
    const { post, navigation, setDetails } = this.props
    setDetails(get('details', post))

    navigation.setParams({
      headerTitle: post ? 'Edit Post' : 'New Post',
      save: this.save
    })
  }

  addImage = ({ local, remote }) => {
    this.setState({
      imageUrls: uniq(this.state.imageUrls.concat(remote))
    })
  }

  removeImage = url => {
    this.setState({
      imageUrls: this.state.imageUrls.filter(u => u !== url)
    })
  }

  render () {
    const { details, editDetails, postId } = this.props
    const { title, type, imageUrls, isSaving } = this.state

    if (postId && !details) return <Loading />

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          <SectionLabel>What are you posting today?</SectionLabel>
          <View style={[styles.typeButtonRow, styles.section]}>
            {['discussion', 'request', 'offer'].map(t =>
              <TypeButton type={t} key={t} selected={t === type}
                onPress={() => !isSaving && this.setState({type: t})} />)}
          </View>

          <SectionLabel>Title</SectionLabel>
          <View style={[styles.textInputWrapper, styles.section]}>
            <TextInput value={title} style={styles.textInput}
              onChangeText={title => this.setState({title})}
              placeholder={titlePlaceholders[type]} editable={!isSaving}
              underlineColorAndroid='transparent' />
          </View>

          <SectionLabel>Details</SectionLabel>
          <TouchableOpacity style={[styles.textInputWrapper, styles.section, styles.details]}
            onPress={() => !isSaving && editDetails()}>
            <Details details={details} placeholder={detailsPlaceholder} />
          </TouchableOpacity>

          <SectionLabel>Image</SectionLabel>
          <ImageSelector
            onAdd={this.addImage}
            onRemove={this.removeImage}
            imageUrls={imageUrls} />
        </View>
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?'
}

const detailsPlaceholder = 'What else should we know?'

export function SectionLabel ({ children }) {
  return <Text style={styles.sectionLabel}>
    {children}
  </Text>
}

export function Details ({details, placeholder}) {
  const style = details ? styles.textInput : styles.textInputPlaceholder
  const body = excerptDetails(details) || placeholder
  return <Text style={style}>{body}</Text>
}

export function TypeButton ({ type, selected, onPress }) {
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
