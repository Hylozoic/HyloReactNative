import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { decode } from 'ent'
import { validateTopicName } from 'hylo-utils/validators'
import { get, uniq, uniqBy } from 'lodash/fp'
import PropTypes from 'prop-types'
import striptags from 'striptags'

import Icon from '../../components/Icon'
import header from 'util/header'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Loading from '../Loading'
import Search from '../Editor/Search'
import { SearchType } from '../Editor/Search/Search.store'
import FileSelector from './FileSelector'
import ImageSelector from './ImageSelector'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

import styles from './PostEditor.styles'
import { rhino30 } from 'style/colors'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save, isSaving, showPicker } = get('state.params', navigation) || {}
    const title = isSaving ? 'Saving...' : 'Save'
    const def = () => {}

    return header(navigation, {
      title: headerTitle,
      right: { disabled: showPicker, text: title, onPress: save || def }
    })
  }

  constructor (props) {
    super(props)
    const { post, communityIds, imageUrls, fileUrls } = props
    this.state = {
      title: get('title', post) || '',
      type: 'discussion',
      communityIds,
      imageUrls,
      fileUrls,
      showPicker: false,
      topics: get('topics', post) || [],
      topicsPicked: false
    }
  }

  save = () => {
    const { navigation, save, details } = this.props
    const { title, type, communityIds, imageUrls, fileUrls } = this.state
    const postData = {
      title,
      type,
      details: details,
      communities: communityIds.map(id => ({id})),
      imageUrls,
      fileUrls
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

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  addImage = ({ local, remote }) => {
    // TODO: use `local` to avoid unnecessary network activity
    this.setState({
      imageUrls: uniq(this.state.imageUrls.concat(remote))
    })
  }

  removeImage = url => {
    this.setState({
      imageUrls: this.state.imageUrls.filter(u => u !== url)
    })
  }

  addFile = ({ local, remote }) => {
    this.setState({
      fileUrls: uniq(this.state.fileUrls.concat(remote))
    })
  }

  removeFile = url => {
    this.setState({
      fileUrls: this.state.fileUrls.filter(u => u !== url)
    })
  }

  cancelTopicPicker = () => {
    this.setState({ showPicker: false })
    this.props.navigation.setParams({ showPicker: false })
  }

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  insertPickerTopic = topic => {
    const t = {
      ...topic,
      name: this.ignoreHash(topic.name)
    }

    if (validateTopicName(t.name) === null) {
      this.insertUniqueTopics([ t ], true)
    }
    this.cancelTopicPicker()
  }

  insertEditorTopics = topicNames => {
    // If topic picker has been used, don't override it with the details editor
    if (this.state.topicsPicked) return

    const validTopicNames = topicNames
      .map(t => {
        const name = this.ignoreHash(t.name)

        // Temporary id for topics without one (note that some may be existing
        // topics, we just don't have their id after processing from markup
        return { id: name, name }
      })
      .filter(({ name }) => validateTopicName(name) === null)
    this.insertUniqueTopics(validTopicNames)
  }

  // Assumptions:
  //  - a maximum of three topics per post are allowed
  //  - topics must be unique
  //  - priority is given to topics already on the post (preserve order)
  // TODO: support topics from more than one community, for crossposting
  insertUniqueTopics = (topicCandidates, topicsPicked) => {
    const topics = uniqBy(
      t => t.name,
      [ ...this.state.topics, ...topicCandidates ]
    ).slice(0, 3)
    this.setState({ topics, topicsPicked })
  }

  removeTopic = topicName => () => this.setState({
    topics: this.state.topics.filter(t => t !== topicName),
    topicsPicked: true
  })

  showTopicPicker = () => {
    this.setState({ showPicker: true })
    this.props.navigation.setParams({ showPicker: true })
  }

  render () {
    const { communityIds, details, editDetails, postId } = this.props
    const { fileUrls, imageUrls, isSaving, showPicker, topics, title, type } = this.state

    if (postId && !details) return <Loading />

    if (showPicker) {
      return <Search style={styles.search}
        communityId={communityIds[0]}
        onCancel={this.cancelTopicPicker}
        onSelect={this.insertPickerTopic}
        type={SearchType.TOPIC} />
    }

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
            <TextInput
              editable={!isSaving}
              onChangeText={title => this.setState({title})}
              placeholder={titlePlaceholders[type]}
              placeholderTextColor={rhino30}
              style={styles.textInput}
              underlineColorAndroid='transparent'
              value={title} />
          </View>

          <SectionLabel>Details</SectionLabel>
          <TouchableOpacity
            style={[
              styles.textInputWrapper,
              styles.section,
              styles.details
            ]}
            onPress={() => !isSaving && editDetails(this.insertEditorTopics)}>
            <Details details={details} placeholder={detailsPlaceholder} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.section,
              styles.textInputWrapper,
              styles.topics
            ]}
            onPress={this.showTopicPicker}>
            <View style={styles.topicLabel}>
              <SectionLabel>Topics</SectionLabel>
              <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
            </View>
            <Topics onPress={this.removeTopic} topics={topics} placeholder={topicsPlaceholder} />
          </TouchableOpacity>

          <SectionLabel>Images</SectionLabel>
          <ImageSelector
            onAdd={this.addImage}
            onRemove={this.removeImage}
            imageUrls={imageUrls}
            style={styles.imageSelector}
            type='post'
            id={postId} />

          <SectionLabel>Files</SectionLabel>
          <FileSelector
            onAdd={this.addFile}
            onRemove={this.removeFile}
            fileUrls={fileUrls}
            type='post'
            id={postId} />
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

const topicsPlaceholder = 'Add topics.'

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

export function Topics ({ onPress, topics, placeholder }) {
  if (topics.length > 0) {
    return <ScrollView horizontal style={styles.topicPillBox}>
      {topics.map((t, i) => <TopicPill key={i} topic={t} onPress={onPress(t)} />)}
    </ScrollView>
  }
  return <Text style={styles.textInputPlaceholder}>{placeholder}</Text>
}

export function TopicPill ({ topic, topic: { name }, onPress }) {
  return <TouchableOpacity onPress={onPress} style={styles.topicPill}>
    <Text style={styles.topicText}>#{name.toLowerCase()}</Text>
    <Icon name='Ex' style={styles.topicRemove} />
  </TouchableOpacity>
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
