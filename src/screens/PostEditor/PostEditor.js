import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { useIsFocused } from '@react-navigation/native'
import { get, uniq, uniqBy, isEmpty, capitalize } from 'lodash/fp'
import moment from 'moment-timezone'
import { Validators } from 'hylo-shared'
import { isIOS } from 'util/platform'
import { showToast, hideToast } from 'util/toast'
import { MAX_TITLE_LENGTH } from './PostEditor.store'
import { rhino30 } from 'style/colors'
import { ModalHeader } from 'navigation/headers'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
// TODO: Convert all 3 of the below to LocationPicker style calls
// ProjectMembers Chooser
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
// Topics Picker
import fetchTopicsForGroupId from 'store/actions/fetchTopicsForGroupId'
import getTopicsForAutocompleteWithNew from 'store/selectors/getTopicsForAutocompleteWithNew'
import TopicRow from 'screens/TopicList/TopicRow'
// Group Chooser
import GroupChooserItemRow from 'screens/ItemChooser/GroupChooserItemRow'
import GroupsList from 'components/GroupsList'
// Components
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import Icon from 'components/Icon'
import FileSelector, { showFilePicker as fileSelectorShowFilePicker } from './FileSelector'
import DatePicker from 'react-native-date-picker'
import ImagePicker from 'components/ImagePicker'
import ImageSelector from './ImageSelector'
import HyloEditorWebView from 'screens/HyloEditorWebView'
import ErrorBubble from 'components/ErrorBubble'
import ItemChooserItemRow from 'screens/ItemChooser/ItemChooserItemRow'
import styles from './PostEditor.styles'

export default function (props) {
  const isFocused = useIsFocused()

  return <PostEditor {...props} isFocused={isFocused} />
}

export class PostEditor extends React.Component {
  constructor (props) {
    super(props)
    const { post } = props
    this.scrollViewRef = React.createRef()
    this.detailsEditorRef = React.createRef()
    this.state = {
      isNewPost: !post?.id,
      title: post?.title || '',
      type: post?.type || 'discussion',
      groups: post?.groups || [],
      imageUrls: post?.imageUrls || [],
      fileUrls: post?.fileUrls || [],
      topics: post?.topics || [],
      members: post?.members || [],
      topicsPicked: false,
      announcementEnabled: false,
      detailsFocused: false,
      details: post?.details,
      titleLengthError: false,
      startTime: post?.startTime
        ? new Date(post.startTime)
        : null,
      endTime: post?.endTime
        ? new Date(post.endTime)
        : null,
      location: post?.location,
      locationObject: post?.locationObject,
      startTimeExpanded: false,
      endTimeExpanded: false,
      isSaving: false
    }
  }

  setHeader = () => {
    const { isSaving, isNewPost } = this.state
    const { navigation } = this.props
    const subject = capitalize(this.state?.type || '')
    const title = isNewPost
      ? `New ${subject}`
      : `Edit ${subject}`
    const headerRightButtonLabel = isSaving
      ? 'Saving...'
      : isNewPost
        ? 'Post'
        : 'Save'
    const headerProps = {
      title,
      headerLeftConfirm: true,
      headerRightButtonLabel,
      headerRightButtonOnPress: this.handleSave,
      headerRightButtonDisabled: isSaving
    }
    navigation.setOptions({
      header: props => <ModalHeader {...props} {...headerProps} />
    })
  }

  componentDidMount () {
    const { isNewPost } = this.state
    const { fetchPost, pollingFindOrCreateLocation, mapCoordinate } = this.props
    if (!isNewPost) {
      fetchPost()
    } else {
      if (mapCoordinate) {
        const locationObject = {
          fullText: `${mapCoordinate.lat},${mapCoordinate.lng}`,
          center: {
            lat: parseFloat(mapCoordinate.lat),
            lng: parseFloat(mapCoordinate.lng)
          }
        }
        pollingFindOrCreateLocation(locationObject, this.handlePickLocation)
      }
    }
    this.setHeader()
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.isFocused
  }

  handleDetailsOnChange = details => {
    this.setState({ details })
  }

  handleTypeOnChange = type => {
    this.setState({ type }, this.setHeader)
  }

  setIsSaving = isSaving => {
    this.setState({ isSaving }, this.setHeader)
  }

  save = async () => {
    if (!this.detailsEditorRef?.current) {
      this.setIsSaving(false)
      return
    }

    const {
      createPost, createProject, updatePost,
      navigation, post
    } = this.props
    const {
      fileUrls, imageUrls, title,
      topics, type, announcementEnabled, members,
      groups, startTime, endTime, location,
      locationObject
    } = this.state
    const postData = {
      id: post.id,
      type,
      details: this.detailsEditorRef.current.getHTML(),
      groups,
      memberIds: members.map(m => m.id),
      fileUrls: uniq(fileUrls),
      imageUrls: uniq(imageUrls),
      title,
      sendAnnouncement: announcementEnabled,
      topicNames: topics.map(t => t.name),
      startTime: startTime && startTime.getTime(),
      endTime: endTime && endTime.getTime(),
      location,
      locationId: locationObject && locationObject.id !== 'NEW' && locationObject.id
    }

    try {
      if (!postData.title) {
        throw new Error('Title cannot be blank')
      }

      if (postData.title.length >= MAX_TITLE_LENGTH) {
        throw new Error(`Title cannot be more than ${MAX_TITLE_LENGTH} characters`)
      }

      if (isEmpty(postData.groups)) {
        throw new Error('You must select a group')
      }

      const saveAction = postData.id
        ? updatePost
        : postData.type === 'project'
          ? createProject
          : createPost
      const { payload, meta, error } = await saveAction(postData)

      if (error) {
        // TODO: handle API errors more appropriately
        throw new Error('Error submitting post')
      }

      const id = meta.extractModel?.getRoot(payload?.data)?.id

      navigation.navigate('Post Details', { id })
    } catch (e) {
      this.setIsSaving(false)
    }
  }

  handleSave = () => {
    const { announcementEnabled } = this.state
    // this.setState({ isSaving: true })
    this.setIsSaving(true)

    if (announcementEnabled) {
      Alert.alert(
        'MAKE AN ANNOUNCEMENT',
        'This means that all members of this group will receive an instant email and push notification about this Post. \n(This feature is available to moderators only.)',
        [
          {
            text: 'Send It',
            onPress: this.save
          },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => this.setIsSaving(false)
          }
        ])
    } else {
      this.save()
    }
  }

  handleAddImage = ({ local, remote }) => {
    // TODO: use `local` to avoid unnecessary network activity
    this.setState({
      imageUrls: uniq(this.state.imageUrls.concat(remote))
    })
  }

  handleRemoveImage = url => {
    this.setState(() => ({
      imageUrls: this.state.imageUrls.filter(u => u !== url)
    }))
  }

  handleAddFile = ({ local, remote }) => {
    this.setState(() => ({
      fileUrls: uniq(this.state.fileUrls.concat(remote))
    }))
  }

  handleAddGroup = group => {
    this.setState(state => ({
      groups: uniqBy(
        c => c.id,
        [...this.state.groups, group]
      )
    }))
  }

  handleRemoveGroup = groupSlug => {
    this.setState(state => ({
      groups: state.groups.filter(group => group.slug !== groupSlug)
    }))
  }

  handleRemoveFile = url => {
    this.setState({
      fileUrls: this.state.fileUrls.filter(u => u !== url)
    })
  }

  showAlert = msg => Alert.alert(msg)

  ignoreHash = name => name[0] === '#' ? name.slice(1) : name

  // Assumptions:
  //  - a maximum of three topics per post are allowed
  //  - topics must be unique
  //  - priority is given to topics already on the post (preserve order)
  handleAddTopic = (providedTopic, picked) => {
    const topic = { ...providedTopic, name: this.ignoreHash(providedTopic.name) }

    if (Validators.validateTopicName(topic.name) === null) {
      this.setState({
        topics: uniqBy(t => t.name, [...this.state.topics, topic]).slice(0, 3),
        topicsPicked: picked !== undefined ? picked : this.state.topicsPicked
      })
    }
  }

  handleRemoveTopic = topicName => () => this.setState({
    topics: this.state.topics.filter(t => t !== topicName),
    topicsPicked: true
  })

  toggleAnnoucement = () => {
    this.toast && hideToast(this.toast)
    this.toast = showToast(`announcement ${!this.state.announcementEnabled ? 'on' : 'off'}`, { isError: this.state.announcementEnabled })
    this.setState({ announcementEnabled: !this.state.announcementEnabled })
  }

  handleUpdateTitle = title => {
    switch (title.length >= MAX_TITLE_LENGTH) {
      case true:
        this.setState({ titleLengthError: true })
        break
      case false:
        this.setState({ titleLengthError: false })
        this.setState({ title })
        break
    }
  }

  updateMembers = members => this.setState(state => ({ members }))

  handleDatePickerExpand = key => () => {
    this.scrollViewRef.current.scrollTo({ x: 20 })
    // this.scrollViewRef.current.scroll()
  }

  handleShowProjectMembersEditor = () => {
    const { navigation } = this.props
    const { members } = this.state
    const screenTitle = 'Project Members'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Type in the names of people to add to project',
      ItemRowComponent: ItemChooserItemRow,
      initialItems: members,
      updateItems: this.updateMembers,
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle)
    })
  }

  handleShowTopicsPicker = () => {
    const { navigation } = this.props
    const screenTitle = 'Pick a Topic'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for a topic by name',
      ItemRowComponent: TopicRow,
      pickItem: topic => { this.handleAddTopic(topic, true) },
      // FIX: Will only find topics for first group
      fetchSearchSuggestions: fetchTopicsForGroupId(get('[0].id', this.state.groups)),
      getSearchSuggestions: getTopicsForAutocompleteWithNew
    })
  }

  handleShowGroupsEditor = () => {
    const { navigation, groupOptions } = this.props
    const screenTitle = 'Post in Groups'
    navigation.navigate('ItemChooser', {
      screenTitle,
      searchPlaceholder: 'Search for group by name',
      defaultSuggestedItemsLabel: 'Your Groups',
      defaultSuggestedItems: groupOptions,
      ItemRowComponent: GroupChooserItemRow,
      pickItem: this.handleAddGroup,
      fetchSearchSuggestions: () => ({ type: 'none' }),
      getSearchSuggestions: (_, { autocomplete: searchTerm }) =>
        groupOptions.filter(c => c.name.toLowerCase().match(searchTerm?.toLowerCase()))
    })
  }

  handleShowLocationPicker = () => {
    LocationPicker({
      navigation: this.props.navigation,
      initialSearchTerm: this.state?.location,
      onPick: this.handlePickLocation
    })
  }

  handlePickLocation = locationObject => {
    this.setState(() => ({ location: locationObject.fullText, locationObject }))
  }

  handleShowFilePicker = async () => {
    this.setState({ filePickerPending: true })
    await fileSelectorShowFilePicker({
      upload: this.props.upload,
      type: 'post',
      id: this.props?.post?.id,
      onAdd: this.handleAddFile,
      onError: this.showAlert,
      onComplete: () => this.setState({ filePickerPending: false }),
      onCancel: () => this.setState({ filePickerPending: false })
    })
  }

  render () {
    const { canModerate, post, postLoading } = this.props
    const {
      fileUrls, imageUrls, isSaving, topics, title, type,
      filePickerPending, announcementEnabled, titleLengthError, members,
      groups, startTime, endTime, location, locationObject, topicsPicked
    } = this.state
    const canHaveTimeframe = type !== 'discussion'
    const toolbarProps = {
      post,
      canModerate,
      filePickerPending,
      announcementEnabled,
      toggleAnnoucement: this.toggleAnnoucement,
      showFilePicker: this.handleShowFilePicker,
      addImage: this.handleAddImage,
      showAlert: this.showAlert
    }

    return (
      <>
        <View style={[styles.typeSelector.row]}>
          <TypeSelector
            disabled={isSaving}
            onValueChange={this.handleTypeOnChange}
            placeholder={{}}
            value={type}
          />
        </View>
        <ScrollView
          ref={this.scrollViewRef}
          keyboardShouldPersistTaps='never'
          keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
          style={styles.scrollContainer}
          // May crash Android due to WebView editor without this
          overScrollMode='never'
        >
          <View style={styles.scrollContent}>
            <Text style={styles.sectionLabel}>Title</Text>
            <View style={[styles.section, styles.textInputWrapper]}>
              <TextInput
                style={styles.textInput}
                editable={!isSaving}
                onChangeText={this.handleUpdateTitle}
                placeholder={titlePlaceholders[type]}
                placeholderTextColor={rhino30}
                underlineColorAndroid='transparent'
                value={title}
                maxLength={MAX_TITLE_LENGTH}
              />
            </View>
            {titleLengthError && (
              <View style={styles.errorView}>
                <ErrorBubble
                  customStyles={styles.errorBubble}
                  errorRowStyle={styles.errorRow}
                  text={`Title can't have more than ${MAX_TITLE_LENGTH} characters.`}
                  topRightArrow
                />
              </View>
            )}

            <Text style={styles.sectionLabel}>Details</Text>
            <View style={[styles.section, styles.textInputWrapper, styles.textInput]}>
              <HyloEditorWebView
                placeholder={detailsPlaceholder}
                contentHTML={post?.details}
                // groupIds={groupOptions && groupOptions.map(g => g.id)}
                onChange={this.handleDetailsOnChange}
                onAddTopic={!topicsPicked && this.handleAddTopic}
                readOnly={postLoading || isSaving}
                widthOffset={24}
                ref={this.detailsEditorRef}
                customEditorCSS={`
                  min-height: 50px;
                  max-height: 140px;
                `}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.section,
                styles.textInputWrapper,
                styles.topics
              ]}
              onPress={this.handleShowTopicsPicker}
            >
              <View style={styles.pressSelection}>
                <Text style={styles.pressSelectionLeft}>Topics</Text>
                <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              <Topics onPress={this.handleRemoveTopic} topics={topics} />
              {/* {topics.length < 1 &&
                <Text style={styles.textInputPlaceholder}>{topicsPlaceholder}</Text>} */}
            </TouchableOpacity>

            {type === 'project' && (
              <TouchableOpacity style={[styles.section, styles.textInputWrapper]} onPress={this.handleShowProjectMembersEditor}>
                <View style={styles.pressSelection}>
                  <Text style={styles.pressSelectionLeft}>Project Members</Text>
                  <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.topicAdd} /></View>
                </View>
                {members.length > 0 && <ProjectMembersSummary members={members} />}
              </TouchableOpacity>
            )}

            {canHaveTimeframe && (
              <>
                <DatePickerWithLabel
                  label='Start Time'
                  date={startTime}
                  minimumDate={new Date()}
                  onSelect={date => this.setState({ startTime: date })}
                />
                <DatePickerWithLabel
                  label='End Time'
                  disabled={!startTime}
                  date={endTime}
                  minimumDate={startTime || new Date()}
                  onSelect={date => this.setState({ endTime: date })}
                />
              </>
            )}

            <TouchableOpacity
              style={[
                styles.section,
                styles.textInputWrapper,
                styles.topics
              ]}
              onPress={this.handleShowLocationPicker}
            >
              <View style={styles.pressSelection}>
                <Text style={styles.pressSelectionLeft}>Location</Text>
                <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              {(location || locationObject) && <Text style={styles.pressSelectionText}>{location || locationObject.fullText}</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.section,
                styles.textInputWrapper
              ]}
              onPress={this.handleShowGroupsEditor}
            >
              <View style={styles.pressSelection}>
                <Text style={styles.pressSelectionLeft}>Post In</Text>
                <View style={styles.pressSelectionRight}><Icon name='Plus' style={styles.topicAdd} /></View>
              </View>
              <GroupsList
                groups={groups}
                columns={1}
                onPress={this.handleShowGroupsEditor}
                onRemove={this.handleRemoveGroup}
                RemoveIcon={() => (
                  <Icon name='Ex' style={styles.groupRemoveIcon} />
                )}
              />
            </TouchableOpacity>

            <Toolbar {...toolbarProps} />

            {!isEmpty(imageUrls) && (
              <ImageSelector
                onAdd={this.handleAddImage}
                onRemove={this.handleRemoveImage}
                imageUrls={imageUrls}
                style={styles.imageSelector}
                type='post'
              />
            )}

            {!isEmpty(fileUrls) && (
              <View>
                <FileSelector
                  onRemove={this.handleRemoveFile}
                  fileUrls={fileUrls}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </>
    )
  }
}

const titlePlaceholders = {
  discussion: 'What do you want to discuss?',
  request: 'What do you need help with?',
  offer: 'How do you want to help?',
  resource: 'What resource is available?',
  project: 'What is your project called?'
}

const detailsPlaceholder = 'What else should we know?'

const topicsPlaceholder = 'Add topics.'

export function TypeSelector (props) {
  return (
    <RNPickerSelect
      {...props}
      style={styles.typeSelector[props.value]}
      useNativeAndroidPickerStyle={false}
      items={
        ['Discussion', 'Event', 'Offer', 'Resource', 'Project', 'Request'].map(type => ({
          label: type.toUpperCase(),
          value: type.toLowerCase(),
          color: styles.typeSelector[type.toLowerCase()].inputIOS.color
        }))
      }
      Icon={() => (
        <Icon name='ArrowDown' style={styles.typeSelector.icon} />
      )}
    />
  )
}

export function Toolbar ({
  post, canModerate, filePickerPending, announcementEnabled,
  toggleAnnoucement, showFilePicker, addImage, showAlert
}) {
  return (
    <View style={styles.bottomBarIcons}>
      <TouchableOpacity onPress={showFilePicker}>
        <Icon
          name='Paperclip'
          style={[styles.bottomBarIcon, filePickerPending && styles.bottomBarIconLoading]}
        />
      </TouchableOpacity>
      <ImagePicker
        iconStyle={styles.bottomBarIcon}
        iconStyleLoading={[styles.bottomBarIcon, styles.bottomBarIconLoading]}
        type='post'
        id={post?.id}
        selectionLimit={10}
        onChoice={addImage}
        onError={showAlert}
      />
      {isEmpty(post) && canModerate && (
        <TouchableOpacity onPress={toggleAnnoucement}>
          <Icon name='Announcement' style={styles.annoucementIcon} color={announcementEnabled ? 'caribbeanGreen' : 'rhino30'} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export function Groups ({ onPress, groups }) {
  if (groups.length > 0) {
    return groups.map((group, index) => (
      <TouchableOpacity onPress={onPress} style={styles.topicPillBox} key={index}>
        <Text style={styles.topicText}>#{group.name}</Text>
        <Icon name='Ex' style={styles.removeGroup} />
      </TouchableOpacity>
    ))
  }

  return null
}

export function Topics ({ onPress, topics }) {
  if (topics.length < 1) return null
  return (
    <ScrollView horizontal style={styles.topicPillBox}>
      {topics.map((t, i) => (
        <TopicPill key={i} topic={t} onPress={onPress(t)} />
      ))}
    </ScrollView>
  )
}

export function TopicPill ({ topic, topic: { name }, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.topicPill}>
      <Text style={styles.topicText}>#{name.toLowerCase()}</Text>
      <Icon name='Ex' style={styles.topicRemove} />
    </TouchableOpacity>
  )
}

export function DatePickerWithLabel ({
  date,
  minimumDate,
  label,
  onSelect,
  disabled,
  styleTemplate = {
    wrapper: [
      styles.section,
      styles.textInputWrapper
    ],
    disabled: styles.pressDisabled,
    expandIconWrapper: styles.pressSelectionRight,
    expandIcon: styles.topicAdd,
    labelText: styles.pressSelectionLeft,
    labelWrapper: styles.pressSelection,
    valueText: styles.pressSelectionText
  },
  dateFormat = 'MM/DD/YYYY LT z'
}) {
  const [open, setOpen] = useState(false)
  const handleOnPress = () => {
    !disabled && setOpen(true)
  }
  const handleOnConfirm = newDate => {
    onSelect(newDate)
    setOpen(false)
  }
  const handleOnCancel = () => {
    onSelect(null)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        style={styleTemplate.wrapper}
        onPress={handleOnPress}
      >
        <View style={styleTemplate.labelWrapper}>
          <Text style={[styleTemplate.labelText, disabled && styleTemplate.disabled]}>
            {label}
          </Text>
          <View style={styleTemplate.expandIconWrapper}>
            <Icon name={open ? 'ArrowUp' : 'ArrowDown'} style={styleTemplate.expandIcon} />
          </View>
        </View>
        {date && !open && (
          <Text style={styleTemplate.valueText}>{moment.tz(date, moment.tz.guess()).format(dateFormat)}</Text>
        )}
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        minimumDate={minimumDate}
        minuteInterval={5}
        date={date || new Date()}
        mode='datetime'
        confirmText={`Set ${label}`}
        onConfirm={handleOnConfirm}
        onCancel={handleOnCancel}
      />
    </>
  )
}
