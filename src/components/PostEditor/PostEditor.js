import React from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import { get, uniq, uniqBy, isEmpty } from 'lodash/fp'
import { validateTopicName } from 'hylo-utils/validators'
import PropTypes from 'prop-types'
import { rhino30 } from 'style/colors'
import { showToast, hideToast } from 'util/toast'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import header from 'util/header'
import confirmDiscardChanges from '../../util/confirmDiscardChanges'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
// ProjectMembers Chooser
import scopedFetchPeopleAutocomplete from '../../store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from '../../store/selectors/scopedGetPeopleAutocomplete'
import ProjectMemberItemRow from '../ItemChooser/ProjectMemberItemRow'
// Topics Picker
import fetchTopicsForCommunityId from '../../store/actions/fetchTopicsForCommunityId'
import getTopicsForAutocompleteWithNew from '../../store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from '../TopicList/TopicRow'
// Community Chooser
import CommunityChooserItemRow from '../ItemChooser/CommunityChooserItemRow'
//
import CommunitiesList from '../CommunitiesList'
import ProjectMembersSummary from '../ProjectMembersSummary'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Icon from '../Icon'
import FileSelector, { showFilePicker } from './FileSelector'
import { showImagePicker } from '../ImagePicker'
import ImageSelector from './ImageSelector'
import InlineEditor, { toHtml } from '../InlineEditor'
import ErrorBubble from '../ErrorBubble'
import styles from './PostEditor.styles'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  static navigationOptions = ({ navigation }) => {
    const { headerTitle, save, isSaving, confirmLeave } = get('state.params', navigation) || {}
    const title = isSaving ? 'Saving...' : 'Save'
    const def = () => {}

    return header(navigation, {
      title: headerTitle,
      right: { disabled: isSaving, text: title, onPress: save || def },
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
      this.props.fetchPost()
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

  constructor (props) {
    super(props)
    const { post, imageUrls, fileUrls, isProject } = props
    this.props.navigation.setParams({
      confirmLeave: this.confirmLeave,
      saveChanges: this.saveChanges
    })
    this.state = {
      title: get('title', post) || '',
      type: get('type', post) || (isProject ? 'project' : 'discussion'),
      communities: get('communities', post),
      imageUrls,
      fileUrls,
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
    confirmDiscardChanges({ onDiscard: onLeave })
  }

  handleDetailsOnChange = (detailsText) => {
    this.setState({detailsText})
  }

  _doSave = () => {
    const { navigation, save } = this.props
    const {
      fileUrls, imageUrls, title, detailsText,
      topics, type, announcementEnabled, members,
      communities
    } = this.state

    const postData = {
      type,
      details: toHtml(detailsText),
      communities,
      memberIds: members.map(m => m.id),
      fileUrls,
      imageUrls,
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name)
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

  addCommunity = community => {
    this.setState(state => ({
      communities: uniqBy(
        c => c.id,
        [...this.state.communities, community]
      )
    }))
  }

  removeCommunity = communityId => {
    this.setState(state => ({
      communities: this.state.communities.filter(c => c.id !== communityId)
    }))
  }

  removeFile = url => {
    this.setState({
      fileUrls: this.state.fileUrls.filter(u => u !== url)
    })
  }

  showAlert = (msg) => Alert.alert(msg)

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  insertPickerTopic = topic => {
    const t = { ...topic, name: this.ignoreHash(topic.name) }

    if (validateTopicName(t.name) === null) this.insertUniqueTopics([ t ], true)
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

  updateMembers = members => this.setState(state => ({ members }))

  removeMember = member => () => {
    const { members } = this.state
    this.updateMembers(members.filter(m => m.id !== member.id))
  }

  openProjectMembersEditor = () => {
    const { navigation } = this.props
    const { members } = this.state
    const screenTitle = 'Project Members'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      ItemRowComponent: ProjectMemberItemRow,
      initialItems: members,
      updateItems: this.updateMembers,
      searchPlaceholder: 'Type in the names of people to add to project',
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete(screenTitle),
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  openTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      ItemRowComponent: TopicRow,
      pickItem: this.insertPickerTopic,
      searchPlaceholder: 'Search for a topic by name',
      // FIX: Will only find topics for first community
      fetchSearchSuggestions: fetchTopicsForCommunityId(get('[0].id', this.state.communities)),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  openCommunitiesEditor = () => {
    const { navigation, communityOptions } = this.props
    const screenTitle = 'Post in Communities'
    navigation.navigate('ItemChooserScreen', {
      screenTitle,
      ItemRowComponent: CommunityChooserItemRow,
      defaultSuggestedItems: communityOptions,
      defaultSuggestedItemsLabel: 'Your Communities',
      pickItem: this.addCommunity,
      searchPlaceholder: 'Search for community by name',
      fetchSearchSuggestions: () => ({ type: 'none' }),
      getSearchSuggestions: (state, { autocomplete: searchTerm }) =>
        communityOptions.filter(c => c.name.match(searchTerm))
    })
  }

  render () {
    const { currentCommunity, canModerate, post, pendingDetailsText, isProject } = this.props
    const {
      fileUrls, imageUrls, isSaving, topics, title, detailsText, type,
      filePickerPending, imagePickerPending, announcementEnabled,
      detailsFocused, titleLengthError, members, communities
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

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollContainer}>
        <View style={styles.scrollContent}>
          {!isProject && <SectionLabel>What are you posting today?</SectionLabel>}
          {!isProject && <View style={[styles.typeButtonRow, styles.section]}>
            {['discussion', 'request', 'offer'].map(t =>
              <TypeButton type={t} key={t} selected={t === type}
                onPress={() => !isSaving && this.setState({type: t})} />)}
          </View>}

          <SectionLabel>Title</SectionLabel>
          <View style={[
            styles.section
          ]}>
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
          {titleLengthError && <View style={styles.errorView}>
            <ErrorBubble
              customStyles={styles.errorBubble}
              errorRowStyle={styles.errorRow} text={`Title can't have more than ${MAX_TITLE_LENGTH} characters.`}
              topRightArrow />
          </View>}

          <SectionLabel>Details</SectionLabel>
          <InlineEditor
            onChange={this.handleDetailsOnChange}
            value={detailsText}
            editable={!pendingDetailsText}
            submitting={isSaving}
            placeholder={detailsPlaceholder}
            inputStyle={styles.detailsEditorInput}
            containerStyle={styles.detailsEditorContainer}
            communityId={get('id', currentCommunity)}
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
            onPress={this.openTopicsPicker}>
            <View style={styles.topicLabel}>
              <SectionLabel>Topics</SectionLabel>
              <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
            </View>
            <Topics onPress={this.removeTopic} topics={topics} />
            {topics.length < 1 &&
              <Text style={styles.textInputPlaceholder}>{topicsPlaceholder}</Text>}
          </TouchableOpacity>

          {isProject && <TouchableOpacity
            style={[
              styles.section,
              styles.textInputWrapper,
              styles.topics
            ]}
            onPress={this.openProjectMembersEditor}>
            <View style={styles.topicLabel}>
              <SectionLabel>Members</SectionLabel>
              <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
            </View>
            {members.length > 0 &&
              <ProjectMembersSummary members={members} textStyle={styles.textInputPlaceholder} />}
            {members.length < 1 &&
              <Text style={styles.textInputPlaceholder}>Who is a part of this project?</Text>}
          </TouchableOpacity>}

          <TouchableOpacity
            style={[
              styles.section,
              styles.textInputWrapper,
              { borderBottomWidth: 0 }
            ]}
            onPress={this.openCommunitiesEditor}>
            <View style={styles.members}>
              <SectionLabel>Post In</SectionLabel>
              <View style={styles.topicAddBorder}><Icon name='Plus' style={styles.topicAdd} /></View>
            </View>
            <CommunitiesList
              communities={communities}
              columns={1}
              onPress={this.removeCommunity}
              RightIcon={iconProps =>
                <Icon name='Ex' style={styles.communityRemoveIcon} {...iconProps} />} />
            {communities.length < 1 &&
              <Text style={styles.textInputPlaceholder}>Select which communities to post in.</Text>}
          </TouchableOpacity>

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
    </KeyboardFriendlyView>
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?',
  project: 'What is your project called?'
}

const detailsPlaceholder = 'What else should we know?'

const topicsPlaceholder = 'Add topics.'

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

export function Communities ({ onPress, communities, placeholder }) {
  if (communities.length > 0) {
    return communities.map((community, index) =>
      <TouchableOpacity onPress={onPress} style={styles.topicPill}>
        <Text style={styles.topicText}>#{community.name}</Text>
        <Icon name='Ex' style={styles.removeCommunity} />
      </TouchableOpacity>
    )
  }
  return <Text style={styles.textInputPlaceholder}>{placeholder}</Text>
}

export function Topics ({ onPress, topics, placeholder }) {
  if (topics.length < 1) return null
  return <ScrollView horizontal style={styles.topicPillBox}>
    {topics.map((t, i) => <TopicPill key={i} topic={t} onPress={onPress(t)} />)}
  </ScrollView>
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
