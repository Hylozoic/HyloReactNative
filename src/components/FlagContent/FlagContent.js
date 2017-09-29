import React, { Component } from 'react'
import { Modal, Text, TouchableOpacity, View, FlatList, List} from 'react-native'
import Icon from '../Icon'
import { toUpper, isEmpty, trim } from 'lodash'
import Prompt from 'react-native-prompt';

export default class FlagContent extends Component {
  state = {
    visible: false,
    promptVisible: false,
    highlightRequired: false
  }

  static defaultProps = {
    visible: false,
    promptVisible: false,
    highlightRequired: false
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({ visible });
  }

  closeModal = () => {
    this.setState({visible: false, promptVisible: false, highlightRequired: false});
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const options = [
      {title: 'Inappropriate Content',
       id: 'inappropriate'},
      {title: 'Spam',
       id: 'spam'},
      {title: 'Offensive',
       id: 'offensive'},
      {title: 'Illegal',
       id: 'illegal'},
      {title: 'Other',
       id: 'other'}
    ]

    const { visible, type = "content", submitFlagContent, linkData } = this.props
    const { selectedCategory, highlightRequired } = this.state

    const optionalExplanation = selectedCategory === 'other' ? false : true

    let inputProps = {
      placeholderTextColor: highlightRequired && !optionalExplanation ? '#d9534f' : '#8994A3'
    }

    return (
      <View>
        <Prompt
          title={`Why was this ${type} '${selectedCategory}'`}
          placeholder={`Explanation ${optionalExplanation ? '' :  highlightRequired ? '(Required)' : ''}`}
          textInputProps={inputProps}
          visible={ this.state.promptVisible }
          onCancel={ () => this.setState({
            promptVisible: false,
            highlightRequired: false,
          }) }
          submitText='Submit'
          onSubmit={ (value) => {
            if (!optionalExplanation && isEmpty(trim(value))) {
              this.setState({highlightRequired: true})
            } else {
              submitFlagContent(selectedCategory, trim(value), linkData)
              this.closeModal()
            }
          } }/>
        <Modal
          transparent={true}
          visible={visible}
          onRequestClose={() => this.closeModal()} >
          <View style={styles.dialog}>
            <View style={styles.dialogOverlay}/>
            <View style={styles.spacer}/>
            <View style={styles.dialogContent}>
              <View style={styles.title}>
                <Text style={styles.titleText}>
                  FLAG THIS {toUpper(type)}
                </Text>
                <TouchableOpacity onPress={() => this.closeModal()}>
                  <Icon name='Ex' style={styles.icon} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                renderItem={({item}) => <FlagOption id={item.id} title={item.title} onPress={() => this.setState({promptVisible: true, selectedCategory: item.id})} />}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

export function FlagOption ({id, title, onPress}) {
  return <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionText}>{title}</Text>
  </TouchableOpacity>

}

const styles = {
  dialog: {
    flex: 1,
  },
  dialogOverlay: {
    backgroundColor: 'rgba(44, 64, 90, 0.7)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  spacer: {
    flex: 1
  },
  dialogContent: {
    height: 362,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: '#CCD1D7',
    overflow: 'hidden'
  },
  title: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderColor: '#AAA',
    borderBottomWidth: 0.5
  },
  titleText: {
    fontFamily: 'Circular-Bold',
    fontSize: 12,
    flex: 1
  },
  icon: {
    width: 20,
    fontSize: 22,
    marginRight: 4
  },
  actionButton: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CCD1D7',
  },
  actionText: {
    fontFamily: 'Circular-Book',
    color: '#2C405A',
    fontSize: 16
  }
}
