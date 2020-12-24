import React from 'react'
import { isEqual, isFunction } from 'lodash/fp'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import ItemChooser from 'screens/ItemChooser'
import { buildModalScreenOptions } from 'navigation/header'

export default class ItemChooserScreen extends React.Component {
  setHeader = () => {
    const { navigation, route } = this.props
    const { screenTitle, updateItems } = route.params
    const headerParams = {
      headerTitle: screenTitle,
      headerLeftOnPress: this.cancel
    }
    if (isFunction(updateItems)) {
      headerParams.headerRightButtonLabel = 'Done'
      headerParams.headerRightButtonOnPress = this.done
    }
    navigation.setOptions(
      buildModalScreenOptions(headerParams)
    )
  }

  componentDidMount () {
    this.setHeader()
  }

  // TODO: Can be merged with setHeader using
  // confirm options in buildModalScreenOptions
  cancel = () => {
    const { route, navigation } = this.props
    const { initialItems, chosenItems } = route.params
    const changed = !isEqual(chosenItems, initialItems)
    confirmDiscardChanges({
      hasChanges: changed,
      onDiscard: navigation.goBack
    })
  }

  done = () => {
    const { route, navigation } = this.props
    const { updateItems, chosenItems } = route.params
    updateItems && updateItems(chosenItems)
    navigation.goBack()
  }

  pickItem = pickedItem => {
    const { route, navigation } = this.props
    const { pickItem } = route.params
    pickItem(pickedItem)
    navigation.goBack()
  }

  updateItems = chosenItems =>
    this.props.navigation.setParams({ chosenItems })

  render () {
    const { route } = this.props
    const { screenTitle, pickItem, updateItems } = route?.params

    return (
      <ItemChooser
        {...this.props.route.params}
        scope={screenTitle}
        pickItem={pickItem ? this.pickItem : undefined}
        updateItems={updateItems ? this.updateItems : undefined}
      />
    )
  }
}
