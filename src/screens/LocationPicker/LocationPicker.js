import { isObject } from 'lodash/fp'
import { useTranslation } from 'react-i18next'
import { locationSearch } from 'screens/LocationPicker/LocationPicker.store'
import LocationPickerItemRow from 'screens/LocationPicker/LocationPickerItemRow'

export default function LocationPicker ({
  screenTitle = 'Choose a Location',
  navigation,
  currentLocation,
  initialSearchTerm = '',
  onPick
}) {
  const { t } = useTranslation()
  navigation.navigate('ItemChooser', {
    screenTitle,
    searchPlaceholder: t('Search for your location'),
    initialSearchTerm,
    ItemRowComponent: LocationPickerItemRow,
    pickItem: onPick,
    searchTermFilter: searchTerm => {
      return isObject(searchTerm)
        ? searchTerm.fullText
        : searchTerm
    },
    fetchSearchSuggestions: (scope, searchTerm) => {
      const proximity = currentLocation?.coords &&
        `${currentLocation.coords.longitude},${currentLocation.coords.latitude}`

      return locationSearch(scope, searchTerm, proximity)
    }
  })
}
