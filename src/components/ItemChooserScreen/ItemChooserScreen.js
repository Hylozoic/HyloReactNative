import React from 'react'
import PropTypes from 'prop-types'
import { isEqual, isFunction } from 'lodash/fp'
import confirmDiscardChanges from '../../util/confirmDiscardChanges'
import header from 'util/header'
import ItemChooser from '../ItemChooser'

export default class ItemChooserScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          updateItems: PropTypes.func,
          pickItem: PropTypes.func,
          screenTitle: PropTypes.string.isRequired,
          // Passed to ItemChooser
          initialItems: PropTypes.array,
          ItemRowComponent: PropTypes.func.isRequired,
          searchPlaceholder: PropTypes.string,
          fetchSearchSuggestions: PropTypes.func.isRequired,
          getSearchSuggestions: PropTypes.func,
          searchTermFilter: PropTypes.func,
          style: PropTypes.object
        })
      })
    })
  }

  static navigationOptions = ({ navigation }) => {
    const done = navigation.getParam('done', () => {})
    const updateItems = navigation.getParam('updateItems')
    const cancel = navigation.getParam('cancel', () => {})
    const screenTitle = navigation.getParam('screenTitle')
    const headerParams = {
      title: screenTitle,
      headerBackButton: cancel
    }
    if (isFunction(updateItems)) {
      headerParams.right = {
        text: 'Done',
        onPress: done
      }
    }
    return header(navigation, headerParams)
  }

  constructor (props) {
    super(props)
    this.props.navigation.setParams({
      done: this.done,
      cancel: this.cancel,
      chosenItems: this.props.navigation.getParam('initialItems')
    })
  }

  cancel = () => {
    const { navigation } = this.props
    const { initialItems, chosenItems } = route.params
    const changed = !isEqual(chosenItems, initialItems)
    confirmDiscardChanges({
      hasChanges: changed,
      onDiscard: navigation.goBack
    })
  }

  done = () => {
    const { navigation } = this.props
    const { updateItems, chosenItems } = route.params
    updateItems && updateItems(chosenItems)
    navigation.goBack()
  }

  pickItem = pickedItem => {
    const { navigation } = this.props
    const { pickItem } = route.params
    pickItem(pickedItem)
    navigation.goBack()
  }

  updateItems = chosenItems =>
    this.props.navigation.setParams({ chosenItems })

  render () {
    const screenTitle = this.props.navigation.getParam('screenTitle')
    const pickItem = this.props.navigation.getParam('pickItem')
    const updateItems = this.props.navigation.getParam('updateItems')

    return <ItemChooser
      {...this.props.route.params}
      scope={screenTitle}
      pickItem={pickItem ? this.pickItem : undefined}
      updateItems={updateItems ? this.updateItems : undefined} />
  }
}
