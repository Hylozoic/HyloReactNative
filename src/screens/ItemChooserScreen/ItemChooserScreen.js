import React from 'react'
import { isEqual, isFunction } from 'lodash/fp'
import ItemChooser from 'screens/ItemChooser'
import { buildModalScreenOptions } from 'navigation/header'

export default class ItemChooser extends React.Component {
  componentDidMount () {
    const { route } = this.props
    const { initialItems } = route.params
    this.updateItems(initialItems)
    this.setHeader()
  }

  componentDidUpdate (prevProps) {
    const { route } = this.props
    const { initialItems, chosenItems } = route.params
    if (
      !isEqual(prevProps.chosenItems, chosenItems) ||
      !isEqual(prevProps.initialItems, initialItems)
    ) {
      this.setHeader()
    }
  }

  setHeader = () => {
    const { navigation, route } = this.props
    const { screenTitle, updateItems, initialItems, chosenItems } = route.params
    const headerParams = {
      headerTitle: screenTitle,
      headerLeftOnPress: navigation.goBack,
      headerLeftConfirm: !isEqual(chosenItems, initialItems)
    }
    if (isFunction(updateItems)) {
      headerParams.headerRightButtonLabel = 'Done'
      headerParams.headerRightButtonOnPress = this.done
    }
    navigation.setOptions(
      buildModalScreenOptions(headerParams)
    )
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
