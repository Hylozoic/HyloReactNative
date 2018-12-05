import React from 'react'
import {
  TouchableOpacity,
  Text,
  Modal
} from 'react-native'
import ItemChooser from '../ItemChooser'

export default class ItemChooserModal extends React.Component {
  state = { visible: false }

  showModal = () => this.setState({ visible: true })

  hideModal = () => this.setState({ visible: false })

  render () {
    const {
      openerStyle,
      children,
      modalTitle,
      ItemRowComponent,
      initialItems,
      pickItem,
      updateItems,
      searchPlaceholder,
      fetchSearchSuggestions,
      getSearchSuggestions
    } = this.props
    const { visible } = this.state

    return <React.Fragment>
      <TouchableOpacity style={openerStyle} onPress={this.showModal}>{children}</TouchableOpacity>
      <Modal visible={visible} animationType='slide' transparent={false} onRequestClose={this.hideModal}>
        {modalTitle && <Text>{modalTitle}</Text>}
        <TouchableOpacity onPress={this.hideModal}>
          <Text>Close Modal</Text>
        </TouchableOpacity>
        <ItemChooser
          ItemRowComponent={ItemRowComponent}
          initialItems={initialItems}
          pickItem={pickItem}
          updateItems={updateItems}
          searchPlaceholder={searchPlaceholder}
          fetchSearchSuggestions={fetchSearchSuggestions}
          getSearchSuggestions={getSearchSuggestions} />
      </Modal>
    </React.Fragment>
  }
}
