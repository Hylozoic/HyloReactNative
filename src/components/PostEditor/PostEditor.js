import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal
} from 'react-native'
import { validateTopicName } from 'hylo-utils/validators'
import { get, uniq, uniqBy, isEmpty } from 'lodash/fp'
import PropTypes from 'prop-types'
import ProjectMemberPicker from '../ProjectMemberPicker'

import Icon from '../../components/Icon'
import header from 'util/header'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Search from '../Search'
import { SearchType } from '../Search/Search.store'
import {
  MAX_TITLE_LENGTH
} from './PostEditor.store'
import FileSelector, { showFilePicker } from './FileSelector'
import { showImagePicker } from '../ImagePicker'
import ImageSelector from './ImageSelector'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import InlineEditor, { toHtml } from '../InlineEditor'
import ErrorBubble from '../ErrorBubble'
import styles from './PostEditor.styles'
import { rhino30 } from 'style/colors'
import { showToast, hideToast } from 'util/toast'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save, isSaving, confirmLeave, showTopicPicker, showMemberPicker } = get('state.params', navigation) || {}
    const title = isSaving ? 'Saving...' : 'Save'
    const def = () => {}

    return header(navigation, {
      title: headerTitle,
      right: { disabled: showTopicPicker || showMemberPicker || isSaving, text: title, onPress: save || def },
      headerBackButton: () => confirmLeave(navigation.goBack)
    })
  }

  componentDidMount () {
    const { navigation, isNewPost } = this.props
    navigation.setParams({
      headerTitle: this.headerTitle(),
      save: this.save
    })
    if (!isNewPost) {
      this.props.fetchDetailsAndMembers()
    }
  }

  headerTitle () {
    const { isNewPost, isProject } = this.props
    const objectName = isProject ? 'Project' : 'Post'
    return isNewPost ? `New ${objectName}` : `Edit ${objectName}`
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  componentDidUpdate (prevProps) {
    if (get('post.detailsText', this.props) !== get('post.detailsText', prevProps)) {
      this.setState({detailsText: get('post.detailsText', this.props)})
    }
    if (get('post.members', this.props) !== get('post.members', prevProps)) {
      this.setState({members: get('post.members', this.props)})
    }
  }

  constructor (props) {
    super(props)
    const { post, communityIds, imageUrls, fileUrls } = props
    this.props.navigation.setParams({
      confirmLeave: this.confirmLeave,
      saveChanges: this.saveChanges
    })
    this.state = {
      title: get('title', post) || '',
      type: 'discussion',
      communityIds,
      imageUrls,
      fileUrls,
      showTopicPicker: false,
      topics: get('topics', post) || [],
      members: get('members', post) || [],
      topicsPicked: false,
      announcementEnabled: false,
      detailsFocused: false,
      detailsText: get('detailsText', post) || '',
      titleLengthError: false
    }
  }

  confirmLeave = (onLeave) => {
    Alert.alert(
      'You may have unsaved changes',
      'Are you sure you want to discard your changes?',
      [
        {text: 'Discard', onPress: onLeave},
        {text: 'Continue Editing', style: 'cancel'}
      ])
  }

  handleDetailsOnChange = (detailsText) => {
    this.setState({detailsText})
  }

  _doSave = () => {
    const { navigation, save } = this.props
    const { communityIds, fileUrls, imageUrls, title, detailsText, topics, type, announcementEnabled, members } = this.state

    const postData = {
      communities: communityIds.map(id => ({id})),
      details: toHtml(detailsText),
      fileUrls,
      imageUrls,
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      type,
      memberIds: members.map(m => m.id)
    }

    return save(postData)
      .catch(e => {
        this.setState({isSaving: false})
        navigation.setParams({isSaving: false})
      })
  }

  save = () => {
    const { navigation } = this.props
    const { announcementEnabled } = this.state

    this.setState({isSaving: true})
    navigation.setParams({isSaving: true})

    if (announcementEnabled) {
      Alert.alert(
        'MAKE AN ANNOUNCEMENT',
        'This means that all members of this community will receive an instant email and push notification about this Post. \n(This feature is available to moderators only.)',
        [
          {text: 'Send It', onPress: this._doSave},
          {text: 'Go Back',
            style: 'cancel',
            onPress: () => {
              this.setState({isSaving: false})
              navigation.setParams({isSaving: false})
            }}
        ])
    } else {
      this._doSave()
    }
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

  showAlert = (msg) => Alert.alert(msg)

  cancelTopicPicker = () => {
    this.setState({ showTopicPicker: false })
    this.props.navigation.setParams({ showTopicPicker: false })
  }

  cancelMemberPicker = () => {
    this.setState({ showMemberPicker: false })
    this.props.navigation.setParams({ showMemberPicker: false })
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

  insertEditorTopic = topics => {
    // If topic picker has been used, don't override it with the details editor
    if (this.state.topicsPicked) return

    const validTopics = topics.filter(({ name }) => validateTopicName(name) === null)
    this.insertUniqueTopics(validTopics, false)
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
    this.setState({ showTopicPicker: true })
    this.props.navigation.setParams({ showTopicPicker: true })
  }

  showMemberPicker = () => {
    this.setState({ showMemberPicker: true })
    this.props.navigation.setParams({ showMemberPicker: true })
  }

  _showFilePicker = () => {
    this.setState({filePickerPending: true})
    showFilePicker({
      upload: this.props.upload,
      type: 'post',
      id: get('post.id', this.props),
      onAdd: this.addFile,
      onError: this.showAlert,
      onComplete: () => this.setState({filePickerPending: false})
    })
  }

  _showImagePicker = () => {
    this.setState({imagePickerPending: true})
    showImagePicker({
      upload: this.props.upload,
      type: 'post',
      id: get('post.id', this.props),
      onChoice: this.addImage,
      onError: this.showAlert,
      onCancel: () => this.setState({imagePickerPending: false}),
      onComplete: () => this.setState({imagePickerPending: false})
    })
  }

  toggleAnnoucement = () => {
    this.toast && hideToast(this.toast)
    this.toast = showToast(`announcement ${!this.state.announcementEnabled ? 'on' : 'off'}`, {isError: this.state.announcementEnabled})
    this.setState({announcementEnabled: !this.state.announcementEnabled})
  }

  updateTitle = (title) => {
    switch (title.length >= MAX_TITLE_LENGTH) {
      case true:
        this.setState({titleLengthError: true})
        break
      case false:
        this.setState({titleLengthError: false})
        this.setState({title})
        break
    }
  }

  updateMembers = members => {
    this.setState({
      members
    })
  }

  removeMember = member => () => {
    const { members } = this.state
    this.updateMembers(members.filter(m => m.id != member.id))
  }

  render () {
    const { communityIds, canModerate, post, pendingDetailsText, shouldShowTypeChooser, isProject } = this.props

    const { fileUrls, imageUrls, isSaving, showTopicPicker, showMemberPicker,
      topics, title, detailsText, type, filePickerPending, imagePickerPending,
      announcementEnabled, detailsFocused, titleLengthError, members
    } = this.state

    const toolbarProps = {
      post,
      canModerate,
      filePickerPending,
      imagePickerPending,
      announcementEnabled,
      toggleAnnoucement: this.toggleAnnoucement,
      showImagePicker: this._showImagePicker,
      showFilePicker: this._showFilePicker
    }

    const communityId = get('[0]', communityIds)

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          {shouldShowTypeChooser && <SectionLabel>What are you posting today?</SectionLabel>}
          {shouldShowTypeChooser && <View style={[styles.typeButtonRow, styles.section]}>
            {['discussion', 'request', 'offer'].map(t =>
              <TypeButton type={t} key={t} selected={t === type}
                onPress={() => !isSaving && this.setState({type: t})} />)}
          </View>}
          <SectionLabel>Title</SectionLabel>
          <View style={[styles.textInputWrapper, styles.section]}>
            <TextInput
              editable={!isSaving}
              onChangeText={this.updateTitle}
              placeholder={titlePlaceholders[type]}
              placeholderTextColor={rhino30}
              style={styles.textInput}
              underlineColorAndroid='transparent'
              value={title}
              maxLength={MAX_TITLE_LENGTH} />
          </View>
          {titleLengthError && <View style={styles.errorView}><ErrorBubble customStyles={styles.errorBubble} errorRowStyle={styles.errorRow} text={`Title can't have more than ${MAX_TITLE_LENGTH} characters.`} topRightArrow /></View>}

          <SectionLabel>Details</SectionLabel>
          <InlineEditor
            onChange={this.handleDetailsOnChange}
            value={detailsText}
            editable={!pendingDetailsText}
            submitting={isSaving}
            placeholder={detailsPlaceholder}
            inputStyle={styles.detailsEditorInput}
            containerStyle={styles.detailsEditorContainer}
            communityId={communityId}
            autoGrow={false}
            onFocusToggle={(isFocused) => this.setState({detailsFocused: isFocused})}
            onInsertTopic={this.insertEditorTopic}
          />

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

          {isProject && <TouchableOpacity
            style={[
              styles.section,
              styles.textInputWrapper
            ]}
            onPress={this.showMemberPicker}>
            <View style={styles.topicLabel}>
              <SectionLabel>Members</SectionLabel>
              <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
            </View>
            <Topics onPress={this.removeMember} topics={members} placeholder={membersPlaceholder} />
          </TouchableOpacity>}

          {!isEmpty(imageUrls) && <View>
            <SectionLabel>Images</SectionLabel>
            <ImageSelector
              onAdd={this.addImage}
              onRemove={this.removeImage}
              imageUrls={imageUrls}
              style={styles.imageSelector}
              type='post' />
          </View>}

          {!isEmpty(fileUrls) && <View>
            <SectionLabel>Files</SectionLabel>
            <FileSelector
              onRemove={this.removeFile}
              fileUrls={fileUrls} />
          </View>}
        </View>
        {detailsFocused && <Toolbar {...toolbarProps} />}
      </ScrollView>
      {!detailsFocused && <Toolbar {...toolbarProps} />}
      {showTopicPicker && <Modal
        animationType='slide'
        transparent={false}
        visible={showTopicPicker}
        onRequestClose={() => {
          this.setState({showTopicPicker: false})
        }}>
        <Search style={styles.search}
          communityId={communityId}
          onCancel={this.cancelTopicPicker}
          onSelect={this.insertPickerTopic}
          type={SearchType.TOPIC} />
      </Modal>}
      {showMemberPicker && <Modal
        animationType='slide'
        transparent={false}
        visible={showMemberPicker}
        onRequestClose={() => {
          this.setState({showMemberPicker: false})
        }}>
        <ProjectMemberPicker
          members={members}
          onCancel={this.cancelMemberPicker}
          updateMembers={this.updateMembers} />
      </Modal>}
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

const membersPlaceholder = 'Who is a part of this project?'

export function Toolbar ({post, canModerate, filePickerPending, imagePickerPending, announcementEnabled, toggleAnnoucement, showFilePicker, showImagePicker}) {
  return <View style={styles.bottomBar}>
    <View style={styles.bottomBarIcons}>
      <TouchableOpacity onPress={showFilePicker}><Icon name={filePickerPending ? 'Clock' : 'Paperclip'} style={styles.bottomBarIcon} /></TouchableOpacity>
      <TouchableOpacity onPress={showImagePicker}><Icon name={imagePickerPending ? 'Clock' : 'AddImage'} style={styles.bottomBarIcon} /></TouchableOpacity>
      {isEmpty(post) && canModerate && <TouchableOpacity onPress={toggleAnnoucement}><Icon name={'Announcement'} style={styles.annoucementIcon} color={announcementEnabled ? 'caribbeanGreen' : 'rhino30'} /></TouchableOpacity>}
    </View>
  </View>
}

export function SectionLabel ({ children }) {
  return <Text style={styles.sectionLabel}>
    {children}
  </Text>
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
